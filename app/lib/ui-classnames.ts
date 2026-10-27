// Shared form-control classnames. Single source of truth so inputs, selects,
// textareas, and buttons stay visually consistent across every form in the
// app — border radius and control height must never be redefined locally.
// See .agents/style-guide.md §6/§7 for the rules these encode.

export const FIELD_HEIGHT = "h-12";

export const INPUT_CLASS =
  "w-full h-12 bg-white border border-slate-200 rounded-lg px-6 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";

export const SELECT_CLASS = INPUT_CLASS;

// Textareas can't share a fixed height (they need to grow), but they share
// every other dimension with INPUT_CLASS: same radius, same horizontal
// padding, same vertical padding as an input's centered text, same type size.
export const TEXTAREA_CLASS =
  "w-full bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none";

export const BUTTON_PRIMARY_CLASS =
  "h-12 inline-flex items-center justify-center px-8 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 active:scale-95 transition-all text-caption disabled:opacity-50";

export const BUTTON_SECONDARY_CLASS =
  "h-12 inline-flex items-center justify-center px-8 border border-slate-200 text-slate-700 rounded-lg hover:border-emerald-500 transition-all text-caption";
