export default function interestProjectDuration(
  principal,
  monthlyPmts,
  projectMonths,
  monthlyInterest
) {
  let interestAccrued = 0;
  let remainingBalance = principal;

  for (let i = 0; i < projectMonths; i++) {
    const interest = remainingBalance * monthlyInterest;
    interestAccrued += interest;
    remainingBalance += interest - monthlyPmts;
  }

  return interestAccrued;
}
