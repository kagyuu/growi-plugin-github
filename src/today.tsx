import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import './today.css'

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
}

export const todayPlugin: Plugin = function() {
  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as GrowiNode;

      if (n.name !== 'today') return;

      const attributeDate = n.attributes['date'];

      // UUIDを計算する
      const uuid = "today-" + Math.random().toString(36).slice(2);

      // GrowiNode の value には、複雑な HTML を直接書けないため、id 属性を付与してから
      // DOM 上で書き換える方法を取る
      n.type = 'html';
      n.value = `<div id="${uuid}"></div>`

      const id = setInterval(() => {
        if (document.querySelector('#' + uuid) != null) {
          document.querySelector('#' + uuid)!.innerHTML = createTodayNode(attributeDate);
          clearInterval(id);
        }
      }, 100);
    });
  };
};

const createTodayNode = function(attributeDate: string) {
  const now = attributeDate ? new Date(attributeDate) : new Date();

  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();

  // nowの直近の月曜日を求める
  const formerMonday = (0 === day) ? date - 6 : date - (day - 1);
  const nextMonday = formerMonday + 7;

  var html = [];
  html.push('<fieldset class="today-fieldset">');
  html.push('<legend>' + now.toISOString().slice(0, 10) + '</legend>');
  html.push(year.toString());
  html.push('<br/>');
  html.push(progress(new Date(year, 0, 1), new Date(year + 1, 0, 1), now));
  html.push('<br/>');
  html.push(now.toLocaleDateString('en', {month: 'long'}));
  html.push('<br/>');
  html.push(progress(new Date(year, month, 1), new Date(year, month+1, 1), now));
  html.push('<br/>');
  html.push('Week ' + calcIsoWeekNumber(now));
  html.push('<br/>');
  html.push(progress(new Date(year, month, formerMonday), new Date(year, month, nextMonday), now));
  html.push('<br/>');
  html.push(now.toLocaleDateString('en', {weekday: 'long'}));
  html.push('<br/>');
  html.push(progress(new Date(year, month, date), new Date(year, month, date + 1), now));
  html.push('</fieldset>');

  return html.join('');
}

const msecInDay = 24 * 60 * 60 * 1000;

const progress = function(start: Date, end: Date, now: Date): string {
  const total = (end.getTime() - start.getTime()) / msecInDay;
  const current = (now.getTime() - start.getTime()) / msecInDay;
  const percent = Math.floor((current / total) * 100);

  const current_rounded = current.toFixed(2);

  return `<meter value="${current}" min="0" max="${total}" title="${percent}% (${current_rounded}/${total})">${percent}% (${current_rounded}/${total})</meter>`;
}

/**
 * ISO 8601 週番号を計算する.
 * 年の最初の木曜日を含む週が第1週となる。
 * 年初の曜日が金曜・土曜・日曜の場合、前年の最終週番号を返す。
 * @param now 現在時刻
 * @returns 週番号
 */
const calcIsoWeekNumber = function(now: Date): number {
  const year = now.getFullYear();
  const weekNumber = _calcIsoWeekNumber(now, year);

  // 年初の週が木曜日を含まない場合、前年の週番号を返す
  return weekNumber === 0 ? _calcIsoWeekNumber(now, year - 1) : weekNumber;
}

const _calcIsoWeekNumber = function(now: Date, year: number): number {

  // 週番号計算の起点となる月曜日を求める (1/1 に対する相対日を求める)
  let offset = 0;
  switch(new Date(year, 0, 1).getDay()) {
    case 0: // Sunday
      offset = 1;
      break;
    case 1: // Monday
      offset = 0;
      break;
    case 2: // Tuesday
      offset = -1;
      break;
    case 3: // Wednesday
      offset = -2;
      break;
    case 4: // Thursday
      offset = -3;
      break;
    case 5: // Friday
      offset = 3;
      break;
    case 6: // Saturday
    default:
      offset = 2;
      break;
  }

  const firstMonday = new Date(year, 0, 1 + offset);

  return Math.ceil((((now.getTime() - firstMonday.getTime()) / msecInDay) + 1) / 7);
}
  