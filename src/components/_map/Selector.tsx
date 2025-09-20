type SelectorProps<T> = {
  options: T[];
  value: number | string;
  onChange: (id: string) => void;
  getLabel: (item: T) => string;
  getId: (item: T) => number;
};

const Selector = <T,>({
  options,
  value,
  onChange,
  getLabel,
  getId,
}: SelectorProps<T>) => {
  return (
    <div>
      <select
        id="generic-select"
        className="bg-white !p-2 border-0 rounded-[8px] min-w-[130px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((item) => (
          <option key={getId(item)} value={getId(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
