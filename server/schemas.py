from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List

# Salary Schemas
class SalaryBase(BaseModel):
    gross_salary: float = Field(..., gt=0, description="Monthly gross salary in NIS")
    child_ages: List[int] = Field(default=[], description="List of ages for children")
    is_woman: bool = Field(default=False, description="Whether the taxpayer is a woman")

class SalaryCreate(SalaryBase):
    pass

class SalaryResponse(SalaryBase):
    id: int
    net_salary: float
    points: float
    tax: float
    social_security: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Mortgage Schemas
class MortgageBase(BaseModel):
    loan_amount: float = Field(..., gt=0, description="Total loan amount")
    interest_rate: float = Field(..., gt=0, description="Annual interest rate in percentage")
    years: int = Field(..., gt=0, le=30, description="Loan term in years")

class MortgageCreate(MortgageBase):
    pass

class MortgageResponse(MortgageBase):
    id: int
    monthly_payment: float
    total_payment: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CalculationResponse(BaseModel):
    salary: Optional[SalaryResponse] = None
    mortgage: Optional[MortgageResponse] = None