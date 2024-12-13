export function formatDate(dateStr) {
  let year, month, day;

  const cleanDateStr = dateStr.replace(/[\s年月日/-]/g, "").toUpperCase();
  const currentYear = new Date().getFullYear();

  if (/^\d{8}$/.test(cleanDateStr)) {
    year = cleanDateStr.slice(0, 4);
    month = cleanDateStr.slice(4, 6);
    day = cleanDateStr.slice(6, 8);
  } else if (/^\d{4}$/.test(cleanDateStr)) {
    year = currentYear;
    month = cleanDateStr.slice(0, 2);
    day = cleanDateStr.slice(2, 4);
  } else if (/^\d{1,2}月\d{1,2}日$/.test(dateStr)) {
    year = currentYear;
    [month, day] = dateStr.match(/\d+/g);
  } else if (/^\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    year = currentYear;
    [month, day] = dateStr.split("/");
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || /^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
    [year, month, day] = dateStr.split(/[-/]/);
  } else if (/^[A-Z]+ \d{1,2}$/i.test(dateStr)) {
    year = currentYear;
    const [monthName, dayStr] = dateStr.split(" ");
    const monthIndex = new Date(`${monthName} 1`).getMonth() + 1;
    if (!isNaN(monthIndex)) {
      month = monthIndex.toString();
      day = dayStr.padStart(2, "0");
    } else {
      console.error("不正な月の名前:", monthName);
      return "不正な日付";
    }
  } else if (/^\d{1,2} \d{1,2}$/.test(dateStr)) {
    year = currentYear;
    [month, day] = dateStr.split(" ");
  } else {
    console.error("不正な日付形式:", dateStr);
    return "不正な日付";
  }

  const formattedDate = `${year}年${month.padStart(2, "0")}月${day.padStart(2, "0")}日`;
  console.log("整形後の日付:", formattedDate);
  return formattedDate;
}