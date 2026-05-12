from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import calculations
from database import engine, get_db

# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Israeli Finance Hub API", version="1.1.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/salary", response_model=schemas.SalaryResponse)
def calculate_salary(request: schemas.SalaryCreate, db: Session = Depends(get_db)):
    """Calculates net salary and persists the result."""
    res = calculations.calculate_israeli_tax(
        request.gross_salary, request.child_ages, request.is_woman,
        request.include_pension, request.has_study_fund
    )
    
    db_record = models.SalaryCalculation(
        gross_salary=request.gross_salary,
        children=len(request.child_ages),
        is_woman=request.is_woman,
        points=res["points"],
        net_salary=res["net_salary"],
        tax=res["tax"],  # This uses the points calculated inside the function
        social_security=res["social_security"],
        pension_deduction=res["pension_deduction"],
        study_fund_deduction=res["study_fund_deduction"],
        employer_cost=res["employer_cost"]
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.post("/api/mortgage", response_model=schemas.MortgageResponse)
def calculate_mortgage(request: schemas.MortgageCreate, db: Session = Depends(get_db)):
    """Calculates mortgage payments and persists the result."""
    res = calculations.calculate_mortgage_details(
        request.loan_amount, request.interest_rate, request.years
    )
    
    db_record = models.MortgageCalculation(
        loan_amount=request.loan_amount,
        interest_rate=request.interest_rate,
        years=request.years,
        monthly_payment=res["monthly_payment"],
        total_payment=res["total_payment"]
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/api/history/salary", response_model=List[schemas.SalaryResponse])
def get_salary_history(db: Session = Depends(get_db)):
    return db.query(models.SalaryCalculation).order_by(models.SalaryCalculation.created_at.desc()).all()

@app.get("/api/history/mortgage", response_model=List[schemas.MortgageResponse])
def get_mortgage_history(db: Session = Depends(get_db)):
    return db.query(models.MortgageCalculation).order_by(models.MortgageCalculation.created_at.desc()).all()