from typing import Dict, List

def calculate_israeli_tax(gross_salary: float, child_ages: List[int], is_woman: bool) -> Dict[str, float]:
    """
    Calculates Israeli Net Salary based on 2026 tax brackets (2025 frozen levels).
    """
    # Calculate Nekudot Zichuy (Credit Points)
    # Base: Men 2.25, Women 2.75.
    points = 2.25 + (0.5 if is_woman else 0)

    # Age-based logic for 2026 (including 2024 Parental Points expansion)
    for age in child_ages:
        if age == 0:
            points += 1.5 if is_woman else 1.0
        elif 1 <= age <= 5:
            points += 2.0
        elif 6 <= age <= 17:
            points += 2.0 if is_woman else 1.0
        elif age == 18:
            points += 1.5 if is_woman else 1.0

    # 2026 Monthly Income Tax Brackets (Frozen at 2025 levels)
    brackets = [
        (7120, 0.10),
        (10220, 0.14),
        (14670, 0.20),
        (20410, 0.31),
        (42570, 0.35),
        (57450, 0.47),
        (float('inf'), 0.50)
    ]

    # 1. Calculate Gross Income Tax (Mas Hachnasa)
    taxable_income = gross_salary
    total_tax = 0.0
    previous_limit = 0.0

    for limit, rate in brackets:
        if taxable_income > previous_limit:
            bracket_width = min(taxable_income, limit) - previous_limit
            total_tax += bracket_width * rate
            previous_limit = limit
        else:
            break

    # 2. Subtract Credit Points (Nekudot Zichuy) - 2026 value is 250 NIS per point
    tax_credit = points * 250.0
    final_income_tax = max(0.0, total_tax - tax_credit)

    # 3. National Insurance & Health Tax (Bituach Leumi + Mas Briut)
    # 2026 Reduced rate up to 7,738 NIS (60% of projected average wage).
    # Includes the legislated 0.15% Health Tax increase for 2025/2026.
    low_bracket_limit = 7738.0
    if gross_salary <= low_bracket_limit:
        social_security = gross_salary * 0.0676
    else:
        social_security = (low_bracket_limit * 0.0676) + ((gross_salary - low_bracket_limit) * 0.1715)

    net_salary = gross_salary - final_income_tax - social_security

    return {
        "net_salary": round(net_salary, 2),
        "points": round(points, 2),
        "tax": round(final_income_tax, 2),
        "social_security": round(social_security, 2)
    }

def calculate_mortgage_details(loan_amount: float, annual_interest: float, years: int) -> Dict[str, float]:
    """
    Calculates monthly payment using the Spitzer method (Fixed Payment).
    """
    monthly_rate = (annual_interest / 100) / 12
    number_of_payments = years * 12

    if monthly_rate == 0:
        monthly_payment = loan_amount / number_of_payments
    else:
        # Standard PMT formula: P * (r(1+r)^n) / ((1+r)^n - 1)
        monthly_payment = (loan_amount * monthly_rate * (1 + monthly_rate) ** number_of_payments) / \
                          ((1 + monthly_rate) ** number_of_payments - 1)

    total_payment = monthly_payment * number_of_payments

    return {
        "monthly_payment": round(monthly_payment, 2),
        "total_payment": round(total_payment, 2)
    }