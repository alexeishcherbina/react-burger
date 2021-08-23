import {differenceInDays, isSameDay, format, subDays} from 'date-fns';

export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, props) {
  props = props || {};
  let exp = props.expires;
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }
  if (exp && exp.toUTCString) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  updatedCookie += ';path=/'; // Создаём куки с path в корне. В отладчике были замечены случаи, когда куки создавались
  // с разными path, это приводило к невозможности разлогина
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, null, {expires: new Date(0)});
}


export function humanReadableDate(comparisonDate) {
  const today = new Date();
  const yesterday = subDays(today, 1);

  let result = '';
  if (isSameDay(comparisonDate, today)) {
    result = 'Сегодня';
  } else if (isSameDay(comparisonDate, yesterday)) {
    result = 'Вчера';
  } else if (differenceInDays(today, comparisonDate) <= 7) {
    const daysWord = differenceInDays(today, comparisonDate) <= 5 ? 'дня' : 'дней';
    result = `${differenceInDays(today, comparisonDate)} ${daysWord} назад`;
  } else {
    result = format(comparisonDate, 'dd.MM.yyyy')
  }
  result += `, ${format(comparisonDate, 'HH:mm')} i-${format(comparisonDate, 'O')}`;
  return result;
}
