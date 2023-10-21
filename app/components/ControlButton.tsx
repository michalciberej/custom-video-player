'use client';

interface ControlButtonProps {
  label: string;
  secondLabel?: string;
  icon: string;
  secondIcon?: string;
  onClick: () => void;
  state?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  label,
  secondLabel,
  icon: Icon,
  secondIcon: SecondIcon,
  onClick,
  state,
}) => {
  if (SecondIcon) {
    return (
      <button
        type='button'
        aria-label={state ? label : secondLabel}
        onClick={onClick}
        className='
        p-1
        md:p-2
        bg-slate-700
        shadow-md
        rounded-full
        outline-none
        text-white
        hover:bg-slate-600
        focus-visible:bg-gray-600
        transition-colors'>
        {state ? <Icon /> : <SecondIcon />}
      </button>
    );
  } else {
    return (
      <button
        type='button'
        aria-label={label}
        onClick={onClick}
        className='
        p-1
        md:p-2
        bg-slate-700
        shadow-md
        rounded-full
        outline-none
        text-white
        hover:bg-slate-600
        focus-visible:bg
        transition-colors'>
        <Icon />
      </button>
    );
  }
};

export default ControlButton;
