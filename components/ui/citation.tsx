/** The marker that ties a sentence back to the passage it came from. */
export function Citation({ marker }: { marker: number }) {
  return (
    <sup className="mx-px rounded-xs border border-ember-line bg-ember-wash px-[3px] py-px align-[2px] font-mono text-[9.5px] leading-none text-ember">
      {marker}
    </sup>
  );
}
