import React from 'react';

const ROW1 = 'QWERTYUIOP'.split('');
const ROW2 = 'ASDFGHJKL'.split('');
const ROW3 = ['ENTER', ...'ZXCVBNM'.split(''), 'BACK'];

/**
 * PUBLIC_INTERFACE
 * On-screen keyboard component.
 */
function Keyboard({ onKey, status }) {
  const disabled = status !== 'in_progress';

  const renderKey = (k) => {
    const isSpecial = k === 'ENTER' || k === 'BACK';
    const cls = ['key'];
    if (k === 'ENTER') cls.push('special');
    if (k === 'BACK') cls.push('backspace');
    return (
      <button
        type="button"
        key={k}
        className={cls.join(' ')}
        onClick={() => !disabled && onKey(k)}
        aria-label={k === 'BACK' ? 'Backspace' : k}
        aria-pressed="false"
        disabled={disabled}
      >
        {k}
      </button>
    );
  };

  return (
    <section className="keyboard" aria-label="On-screen keyboard" role="group">
      <div className="kb-row" role="row">
        {ROW1.map(renderKey)}
      </div>
      <div className="kb-row" role="row" style={{ paddingLeft: 12, paddingRight: 12 }}>
        {ROW2.map(renderKey)}
      </div>
      <div className="kb-row" role="row">
        {ROW3.map(renderKey)}
      </div>
    </section>
  );
}

export default Keyboard;
