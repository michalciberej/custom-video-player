'use client';

interface ControlButtonProps {
  label: string;
  secondLabel: string | null;
  icon: string;
  secondIcon: string | null;
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
  if (SecondIcon !== null) {
    return (
      <button
        type='button'
        aria-label={state ? label : secondLabel}
        onClick={onClick}
        className='
        p-2
        bg-slate-700
        shadow-md
        rounded-full
        outline-none
        hover:bg-slate-600
        focus-visible:bg-gray-600
        transition-all'>
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
        p-2
        bg-slate-700
        shadow-md
        rounded-full
        outline-none
        hover:bg-slate-600
        focus-visible:bg'>
        <Icon />
      </button>
    );
  }
};

export default ControlButton;
