from sqlalchemy import Column, Integer, Float, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class SalaryCalculation(Base):
    __tablename__ = "salary_calculations"

    id = Column(Integer, primary_key=True, index=True)
    gross_salary = Column(Float, nullable=False)
    children = Column(Integer, default=0)
    is_woman = Column(Boolean, default=False)
    points = Column(Float)
    net_salary = Column(Float)
    tax = Column(Float)
    social_security = Column(Float)
    
    # New fields for 2026 expansion
    pension_deduction = Column(Float)
    study_fund_deduction = Column(Float)
    employer_cost = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MortgageCalculation(Base):
    __tablename__ = "mortgage_calculations"

    id = Column(Integer, primary_key=True, index=True)
    loan_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    years = Column(Integer, nullable=False)
    monthly_payment = Column(Float)
    total_payment = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())