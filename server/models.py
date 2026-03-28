from sqlalchemy import Float, Integer, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from database import Base

class SalaryCalculation(Base):
    __tablename__ = "salary_calculations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    gross_salary: Mapped[float] = mapped_column(Float, nullable=False)
    children: Mapped[int] = mapped_column(Integer, default=0)
    is_woman: Mapped[bool] = mapped_column(Boolean, default=False)
    points: Mapped[float] = mapped_column(Float, default=2.25)
    net_salary: Mapped[float] = mapped_column(Float, nullable=False)
    tax: Mapped[float] = mapped_column(Float, nullable=False)
    social_security: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class MortgageCalculation(Base):
    __tablename__ = "mortgage_calculations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    loan_amount: Mapped[float] = mapped_column(Float, nullable=False)
    interest_rate: Mapped[float] = mapped_column(Float, nullable=False)
    years: Mapped[int] = mapped_column(Integer, nullable=False)
    monthly_payment: Mapped[float] = mapped_column(Float, nullable=False)
    total_payment: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())