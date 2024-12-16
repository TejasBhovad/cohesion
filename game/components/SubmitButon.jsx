import '../styles/submit.css';
import { ChevronsRight } from './icons/ChevronsRight';

const SubmitButton = ({ enable, submitFn }) => {
  return (
    <button
      onClick={enable ? submitFn : () => {}}
      className={`bg-black-500/50 relative w-fit overflow-hidden rounded-lg border-2 border-white/10 p-2 pr-4 text-lg font-bold ${
        enable ? 'text-foreground' : 'text-foreground/70'
      }`}
    >
      <div
        className={`absolute left-0 top-0 flex h-full w-12 transform items-center justify-center rounded-sm bg-yellow-400 text-black ${
          enable ? 'chevdiv' : ''
        }`}
      >
        <ChevronsRight size={32} strokeWidth={3} />
      </div>
      <div className={`z-10 pl-14 ${enable ? 'text' : ''}`}>SUBMIT</div>
    </button>
  );
};

export default SubmitButton;
