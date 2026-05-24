import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { AppMode } from '../../types';

interface LayoutProps {
  children: ReactNode;
  mode: AppMode;
  title?: string;
  showBack?: boolean;
  backTo?: string;
  rightElement?: ReactNode;
}

const modeTheme = {
  dadi: 'bg-dadi-bg min-h-screen',
  granddaughter: 'bg-child-bg min-h-screen',
  default: 'bg-gray-50 min-h-screen',
};

export default function Layout({
  children,
  mode,
  title,
  showBack = true,
  backTo,
  rightElement,
}: LayoutProps) {
  const navigate = useNavigate();
  const themeClass = mode ? modeTheme[mode] : modeTheme.default;

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className={`${themeClass} flex flex-col`}>
      {(showBack || title) && (
        <header
          className={`flex items-center justify-between px-4 py-3 ${
            mode === 'dadi' ? 'border-b border-dadi-border' : 'border-b border-child-border'
          }`}
        >
          <div className="w-10">
            {showBack && (
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-xl"
              >
                ←
              </button>
            )}
          </div>

          {title && (
            <h1
              className={`text-center font-bold flex-1 ${
                mode === 'dadi'
                  ? 'text-dadi-lg font-dadi text-dadi-text'
                  : 'text-xl font-child text-child-text'
              }`}
            >
              {title}
            </h1>
          )}

          <div className="w-10 flex justify-end">{rightElement}</div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
