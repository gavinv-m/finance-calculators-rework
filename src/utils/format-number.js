export default function formatNumber(value) {
  let formattedValue =
    value % 1 === 0
      ? Math.abs(value).toLocaleString()
      : Math.abs(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return value < 0 ? `- $${formattedValue}` : `$${formattedValue}`;
}
