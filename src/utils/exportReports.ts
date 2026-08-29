// Export report helper utilities (XLS, CSV, PDF/Print)

export interface ExportColumn<T = any> {
  header?: string;
  label?: string;
  key?: keyof T | string;
  accessor?: (item: T, index: number) => string | number | boolean | null | undefined;
}

/**
 * Clean cell text to prevent CSV injection or comma breaks
 */
function cleanCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Normalize columns definition or auto-generate from object keys
 */
function normalizeColumns<T>(data: T[], columns?: any[]): { header: string; getValue: (item: T, index: number) => any }[] {
  if (Array.isArray(columns) && columns.length > 0) {
    return columns.map(c => {
      const header = c.header || c.label || String(c.key || '');
      const getValue = (item: T, idx: number) => {
        if (typeof c.accessor === 'function') {
          return c.accessor(item, idx);
        }
        if (c.key && typeof item === 'object' && item !== null) {
          return (item as any)[c.key];
        }
        return '';
      };
      return { header, getValue };
    });
  }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const keys = Object.keys(data[0]);
    return keys.map(k => ({
      header: k,
      getValue: (item: T) => (item ? (item as any)[k] : '')
    }));
  }

  return [];
}

/**
 * Export data array to CSV format
 * Supports:
 * - exportToCsv(data, "filename") (auto-infers keys)
 * - exportToCsv(data, columns, "filename")
 */
export function exportToCsv<T = any>(
  data: T[],
  columnsOrFilename?: any[] | string,
  optionalFilename?: string
) {
  if (!Array.isArray(data) || data.length === 0) {
    alert('डाउनलोड करने हेतु कोई डेटा उपलब्ध नहीं है।');
    return;
  }

  let columnsDef: any[] | undefined;
  let filename = 'MP_Pariksha_Setu_Report';

  if (typeof columnsOrFilename === 'string') {
    filename = columnsOrFilename;
  } else if (Array.isArray(columnsOrFilename)) {
    columnsDef = columnsOrFilename;
    if (optionalFilename) filename = optionalFilename;
  }

  const normalizedCols = normalizeColumns(data, columnsDef);
  if (normalizedCols.length === 0) {
    alert('निर्यात हेतु कॉलम उपलब्ध नहीं हैं।');
    return;
  }

  const headerRow = normalizedCols.map(c => cleanCsvCell(c.header)).join(',');
  const dataRows = data.map((item, idx) =>
    normalizedCols.map(c => cleanCsvCell(c.getValue(item, idx))).join(',')
  );

  // Add UTF-8 BOM for Excel to properly render Hindi (Devanagari) script
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/i, '')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data array to XLS (Excel XML / Spreadsheet format with proper Hindi font styling)
 * Supports:
 * - exportToXls(data, "filename")
 * - exportToXls(data, columns, "Title", "filename")
 */
export function exportToXls<T = any>(
  data: T[],
  columnsOrFilename?: any[] | string,
  titleOrFilename?: string,
  optionalFilename?: string
) {
  if (!Array.isArray(data) || data.length === 0) {
    alert('डाउनलोड करने हेतु कोई डेटा उपलब्ध नहीं है।');
    return;
  }

  let columnsDef: any[] | undefined;
  let title = 'प्रशासनिक रिपोर्ट';
  let filename = 'MP_Pariksha_Setu_Report';

  if (typeof columnsOrFilename === 'string') {
    filename = columnsOrFilename;
    title = columnsOrFilename.replace(/_/g, ' ');
  } else if (Array.isArray(columnsOrFilename)) {
    columnsDef = columnsOrFilename;
    if (titleOrFilename) title = titleOrFilename;
    if (optionalFilename) filename = optionalFilename;
    else if (titleOrFilename) filename = titleOrFilename;
  }

  const normalizedCols = normalizeColumns(data, columnsDef);
  if (normalizedCols.length === 0) {
    alert('निर्यात हेतु कॉलम उपलब्ध नहीं हैं।');
    return;
  }

  const tableHeader = normalizedCols.map(c => `<th style="background-color:#7A2A1E; color:#ffffff; padding:10px; font-weight:bold; border:1px solid #ddd;">${c.header}</th>`).join('');
  const tableRows = data.map((item, idx) => {
    const cells = normalizedCols.map(c => {
      const val = c.getValue(item, idx);
      return `<td style="padding:8px 10px; border:1px solid #ddd; text-align:left;">${val ?? ''}</td>`;
    }).join('');
    return `<tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9f6f0'};">${cells}</tr>`;
  }).join('');

  const htmlTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${title.substring(0, 30)}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
      </style>
    </head>
    <body>
      <h2 style="color:#7A2A1E; font-family:Arial, sans-serif; margin-bottom:4px;">MP परीक्षा सेतु — ${title}</h2>
      <p style="color:#666; font-size:12px; margin-top:0;">रिपोर्ट सृजन तिथि: ${new Date().toLocaleString('hi-IN')} | पोर्टल: mppariksha.in</p>
      <table>
        <thead>
          <tr>${tableHeader}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.xls$/i, '')}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Printable / Save-as-PDF View
 * Supports:
 * - exportToPdfPrint(title, columns, data, subtitle)
 * - exportToPdfPrint(data, columns, title, subtitle)
 * - exportToPdfPrint(title, data)
 */
export function exportToPdfPrint(
  arg1: any,
  arg2?: any,
  arg3?: any,
  arg4?: string
) {
  let title = 'मध्य प्रदेश परीक्षा सेतु — प्रशासनिक रिपोर्ट';
  let subtitle = '';
  let columns: any[] | undefined;
  let data: any[] = [];

  // Case 1: exportToPdfPrint(title, columns, data, subtitle)
  if (typeof arg1 === 'string' && Array.isArray(arg2) && Array.isArray(arg3)) {
    title = arg1;
    columns = arg2;
    data = arg3;
    if (typeof arg4 === 'string') subtitle = arg4;
  }
  // Case 2: exportToPdfPrint(title, data)
  else if (typeof arg1 === 'string' && Array.isArray(arg2)) {
    title = arg1;
    data = arg2;
  }
  // Case 3: exportToPdfPrint(data, columns, title, subtitle)
  else if (Array.isArray(arg1)) {
    data = arg1;
    if (Array.isArray(arg2)) columns = arg2;
    if (typeof arg3 === 'string') title = arg3;
    if (typeof arg4 === 'string') subtitle = arg4;
  }

  if (!Array.isArray(data) || data.length === 0) {
    alert('प्रिंट / पीडीएफ हेतु कोई डेटा उपलब्ध नहीं है।');
    return;
  }

  const normalizedCols = normalizeColumns(data, columns);
  if (normalizedCols.length === 0) {
    alert('प्रिंट हेतु कॉलम उपलब्ध नहीं हैं।');
    return;
  }

  const tableHeader = normalizedCols.map(c => `<th>${c.header}</th>`).join('');
  const tableRows = data.map((item, idx) => {
    const cells = normalizedCols.map(c => `<td>${c.getValue(item, idx) ?? ''}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('कृपया ब्राउज़र में पॉप-अप विंडो की अनुमति दें (Allow Pop-ups)।');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">
      <title>${title} — MP परीक्षा सेतु</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #1c1917; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #7A2A1E; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title { font-size: 20px; font-weight: 900; color: #7A2A1E; margin: 0; }
        .tagline { font-size: 11px; color: #b45309; font-weight: bold; margin-top: 2px; }
        .doc-title { font-size: 14px; font-weight: 800; color: #292524; margin-top: 6px; }
        .meta { text-align: right; font-size: 10px; color: #78716c; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10.5px; }
        th { background-color: #7A2A1E; color: white; padding: 8px 6px; text-align: left; font-weight: bold; border: 1px solid #7A2A1E; }
        td { padding: 6px; border: 1px solid #e7e5e4; }
        tr:nth-child(even) { background-color: #fafaf9; }
        .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #e7e5e4; display: flex; justify-content: space-between; font-size: 9px; color: #a8a29e; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fef3c7; border:1px solid #f59e0b; padding:10px 15px; border-radius:8px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>💡 PDF सेव करने के लिए:</strong> प्रिंट डायलॉग में 'Destination' को <strong>'Save as PDF'</strong> चुनें और 'Save' बटन दबाएं।</div>
        <button onclick="window.print()" style="background:#7A2A1E; color:white; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">🖨️ अभी प्रिंट / PDF सेव करें</button>
      </div>

      <div class="header">
        <div>
          <h1 class="logo-title">🏛️ MP परीक्षा सेतु</h1>
          <div class="tagline">मध्यप्रदेश शासन प्रतियोगी परीक्षा पोर्टल • आधिकारिक प्रशासनिक रिपोर्ट</div>
          <div class="doc-title">📋 ${title}</div>
          ${subtitle ? `<div style="font-size:11px; color:#57534e; margin-top:2px;">${subtitle}</div>` : ''}
        </div>
        <div class="meta">
          <div><strong>सृजन तिथि:</strong> ${new Date().toLocaleString('hi-IN')}</div>
          <div><strong>कुल रिकॉर्ड्स:</strong> ${data.length}</div>
          <div><strong>प्रशासक:</strong> अखिलेश कोरसने (Super Admin)</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>${tableHeader}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        <span>MP परीक्षा सेतु • पोर्टल: https://mp-pariksha-setu.onrender.com</span>
        <span>गोपनीय आधिकारिक प्रशासनिक दस्तावेज • केवल अधिकृत उपयोग हेतु</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Generate Printable / Save-as-PDF View for Study Notes & Handouts
 */
export function exportNoteToPdfPrint(note: any) {
  if (!note) return;
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) {
    alert('पॉपअप अवरुद्ध है। कृपया ब्राउज़र में पॉपअप की अनुमति दें।');
    return;
  }

  const title = note.titleHi || note.titleEn || 'हस्तलिखित ई-नोट्स';
  const category = note.category || 'मध्यप्रदेश विशेष';
  const pages = note.pages || 10;
  const summary = note.summaryHi || note.summaryEn || '';
  const content = note.sampleContentHi || note.summaryHi || '';

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">
      <title>${title} — MP परीक्षा सेतु ई-नोट्स PDF</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        body {
          font-family: 'Hind', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1c1917;
          background: #ffffff;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          border-bottom: 3px solid #7A2A1E;
          padding-bottom: 12px;
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .logo-title {
          font-size: 22px;
          font-weight: 800;
          color: #7A2A1E;
          margin: 0;
        }
        .tagline {
          font-size: 11px;
          color: #78716c;
          font-weight: 600;
        }
        .badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
          font-size: 11px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
          margin-top: 4px;
        }
        .note-title {
          font-size: 18px;
          font-weight: bold;
          color: #1c1917;
          margin: 12px 0 6px 0;
        }
        .summary-box {
          background: #fdfaf6;
          border-left: 4px solid #D4A017;
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 12px;
          color: #44403c;
          margin-bottom: 18px;
        }
        .content-box {
          background: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 8px;
          padding: 16px;
          font-size: 13px;
          white-space: pre-wrap;
          line-height: 1.7;
          font-family: inherit;
        }
        .footer {
          margin-top: 25px;
          border-top: 1px dashed #d6d3d1;
          padding-top: 10px;
          font-size: 10px;
          color: #78716c;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fef3c7; border:1px solid #f59e0b; padding:10px 15px; border-radius:8px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>💡 PDF सेव करने के लिए:</strong> प्रिंट डायलॉग में 'Destination' को <strong>'Save as PDF'</strong> चुनें और 'Save' बटन दबाएं।</div>
        <button onclick="window.print()" style="background:#7A2A1E; color:white; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">🖨️ अभी प्रिंट / PDF सेव करें</button>
      </div>

      <div class="header">
        <div>
          <h1 class="logo-title">🏛️ MP परीक्षा सेतु</h1>
          <div class="tagline">मध्यप्रदेश शासन भर्ती परीक्षा हस्तलिखित सार संग्रह एवं ई-नोट्स</div>
          <span class="badge">📂 श्रेणी: ${category} • कुल पृष्ठ: ${pages}</span>
        </div>
        <div style="text-align:right; font-size:11px; color:#57534e;">
          <div><strong>डाउनलोड तिथि:</strong> ${new Date().toLocaleDateString('hi-IN')}</div>
          <div><strong>सत्यापित:</strong> MP परीक्षा सेतु ई-लाइब्रेरी</div>
        </div>
      </div>

      <div class="note-title">📖 ${title}</div>
      ${summary ? `<div class="summary-box"><strong>📋 सारांश:</strong> ${summary}</div>` : ''}

      <div class="content-box">${content}</div>

      <div class="footer">
        <span>MP परीक्षा सेतु • पोर्टल: https://mp-pariksha-setu.onrender.com</span>
        <span>© सर्वाधिकार सुरक्षित • मध्यप्रदेश प्रतियोगी परीक्षार्थियों हेतु</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

