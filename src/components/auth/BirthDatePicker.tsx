'use client';

import { useId, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

const weekdays = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const months = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(new Date(2000, month, 1)));
const dateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function BirthDatePicker({ value, onChange, disabled = false }: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const id = useId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  function changeMonth(offset: number) {
    const date = new Date(year, month + offset, 1);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  }

  return (
    <div>
      <label id={`${id}-label`} className="block text-sm font-bold text-gray-700 mb-2">تاريخ الميلاد *</label>
      <Dialog.Root open={open} onOpenChange={(nextOpen) => {
        if (nextOpen) {
          const initial = value ? new Date(`${value}T00:00:00`) : today;
          setDraft(value);
          setMonth(initial.getMonth());
          setYear(initial.getFullYear());
        }
        setOpen(nextOpen);
      }}>
        <Dialog.Trigger type="button" disabled={disabled} aria-labelledby={`${id}-label ${id}-value`}
          className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-transparent px-4 py-3 text-start text-sm font-normal focus-visible:outline-none focus-visible:border-primary disabled:opacity-60">
          <span id={`${id}-value`} className={value ? 'text-gray-800' : 'text-gray-400'} dir={value ? 'ltr' : 'rtl'}>
            {value ? value.split('-').reverse().join(' / ') : 'اختر تاريخ الميلاد'}
          </span>
          <CalendarDays className="size-5 text-primary" aria-hidden="true" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/55" />
          <Dialog.Popup dir="rtl"
            className="fixed bottom-0 left-0 z-[71] w-full rounded-t-[28px] bg-white px-5 pb-8 pt-6 text-gray-950 shadow-xl outline-none max-h-[94dvh] overflow-y-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-[480px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:px-7 sm:pb-7">
            <Dialog.Description className="sr-only">اختر تاريخ ميلادك ثم اضغط تم لحفظه.</Dialog.Description>
            <header className="mb-8 flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold text-[#20252b]">تاريخ الميلاد</Dialog.Title>
              <Dialog.Close type="button" aria-label="إغلاق التقويم" className="flex size-9 items-center justify-center rounded-full text-[#123c45] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2">
                <X className="size-7" strokeWidth={1.5} />
              </Dialog.Close>
            </header>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="relative flex items-center gap-1 text-lg font-bold">
                <label className="relative">
                  <span aria-hidden="true">{months[month]}</span>
                  <select aria-label="الشهر" value={month} onChange={(event) => setMonth(Number(event.target.value))}
                    className="absolute inset-0 w-full cursor-pointer opacity-0">
                    {months.map((name, index) => <option key={name} value={index} disabled={year === today.getFullYear() && index > today.getMonth()}>{name}</option>)}
                  </select>
                </label>
                <label className="relative">
                  <span aria-hidden="true">{year}</span>
                  <select aria-label="السنة" value={year} onChange={(event) => {
                    const nextYear = Number(event.target.value);
                    setYear(nextYear);
                    if (nextYear === today.getFullYear() && month > today.getMonth()) setMonth(today.getMonth());
                  }} className="absolute inset-0 w-full cursor-pointer opacity-0">
                    {Array.from({ length: today.getFullYear() - 1899 }, (_, index) => today.getFullYear() - index).map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <ChevronLeft className="size-5 text-[#123c45]" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-3" dir="ltr">
                <button type="button" aria-label="الشهر التالي" disabled={isCurrentMonth} onClick={() => changeMonth(1)}
                  className="flex size-9 items-center justify-center rounded-full text-[#123c45] hover:bg-gray-50 disabled:cursor-default disabled:text-[#c9c9c9]">
                  <ChevronLeft className="size-7" strokeWidth={2.5} />
                </button>
                <button type="button" aria-label="الشهر السابق" disabled={year === 1900 && month === 0} onClick={() => changeMonth(-1)}
                  className="flex size-9 items-center justify-center rounded-full text-[#123c45] hover:bg-gray-50 disabled:text-[#c9c9c9]">
                  <ChevronRight className="size-7" strokeWidth={2.5} />
                </button>
              </div>
            </div>
            <table className="w-full table-fixed border-collapse text-center" aria-label={`${months[month]} ${year}`}>
              <thead><tr>{weekdays.map((day) => <th key={day} scope="col" className="pb-2 text-xs font-normal text-[#b6b6b6] sm:text-sm">{day}</th>)}</tr></thead>
              <tbody>
                {Array.from({ length: cellCount / 7 }, (_, week) => (
                  <tr key={week}>
                    {Array.from({ length: 7 }, (_, column) => {
                      const day = week * 7 + column - firstWeekday + 1;
                      if (day < 1 || day > daysInMonth) return <td key={column} />;
                      const date = new Date(year, month, day);
                      const iso = dateValue(date);
                      const selected = draft === iso;
                      return <td key={column} className="py-1.5 sm:py-2">
                        <button type="button" disabled={date > today} aria-pressed={selected}
                          aria-label={new Intl.DateTimeFormat('ar-EG-u-nu-latn', { dateStyle: 'full' }).format(date)}
                          onClick={() => setDraft(iso)}
                          className={`mx-auto flex size-10 items-center justify-center rounded-full text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:text-[#dedede] sm:size-11 sm:text-xl ${selected ? 'bg-[#e2e8e8] font-bold text-[#123c45]' : 'hover:bg-[#f1f5f5] disabled:hover:bg-transparent'}`}>
                          {day}
                        </button>
                      </td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" disabled={!draft} onClick={() => { onChange(draft); setOpen(false); }}
              className="mt-9 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-white hover:bg-primary/90 disabled:cursor-default disabled:opacity-40">تم</button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
