import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns/esm";

// Get the value of the CSS variable
const themeColor3 = getComputedStyle(document.documentElement).getPropertyValue(
  "--theme-color3"
);
// Convert the hex color to RGB
const hexToRgb = (hex) => {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return [r, g, b];
};
const rgbColor = hexToRgb(themeColor3.trim());

const exportToPDF = (
  data,
  generatedBy,
  RequestingBranchCode,
  barnchDtl,
  acctDtl,
  print,
  bankLogo,
  bankLogoType
) => {
  const doc: any = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const bankLogoTypeFormat = bankLogoType?.toUpperCase();

  function addTextWithPageBreak(doc, text, yPosition) {
    const textHeight = doc.getTextDimensions(text).h; // get the height of the text
    if (yPosition + textHeight > pageHeight) {
      // If the text exceeds the page, create a new page
      doc.addPage();
      yPosition = 10; // reset the position for the new page
    }
    // Add the text at the given position
    doc.text(text, 10, yPosition);
    return yPosition + textHeight; // return the new y position after adding text
  }

  // Display same content in all page
  function textForAllPage() {
    doc.setFontSize(6);
    doc.setTextColor(80);
    doc.setFont(undefined, "normal");
    doc.text(
      `Bank Name: ${barnchDtl?.bankName ?? ""} / Branch: ${
        barnchDtl.branchName ?? ""
      } / Account Number: ${acctDtl?.accountNumber ?? ""} / Customer Name: ${
        acctDtl.customerName ?? ""
      } / SOA ${acctDtl?.statementPeriod ?? ""}`,
      10,
      5,
      { maxWidth: pageWidth - 20 }
    );
  }

  const margin = 10; // Margin size in pixels
  const spacing = 15; // Spacing between sections in pixels
  let startY = margin;
  let exportContentStartY = 0;
  const maxWidth = 95;

  // Add the bank logo
  // const logoWidth = 30;
  // const logoHeight = 12;
  // const logoX = spacing;
  // const logoY = 13;
  // doc.addImage(
  //   bankLogo ?? "",
  //   bankLogoTypeFormat,
  //   logoX,
  //   logoY,
  //   logoWidth,
  //   logoHeight
  // );

  // Bank name
  doc.setFontSize(12);
  const bankNameX =
    pageWidth / 2 - doc.getTextWidth(barnchDtl?.bankName ?? "") / 2;
  let bankNameY = 8;
  doc.text(barnchDtl?.bankName ?? "", bankNameX, bankNameY, {
    maxWidth: maxWidth,
  });
  const bankNameLines = doc.splitTextToSize(bankNameY, maxWidth);
  bankNameY += doc.getTextDimensions(bankNameLines).h;

  // Address
  doc.setFontSize(6);
  const bankAddressText = `Branch Address: ${barnchDtl?.branchAddress ?? ""}`;
  const bankAddressLines = doc.splitTextToSize(bankAddressText, 100);
  const bankAddressWidth = 100;
  const bankAddressX = (pageWidth - bankAddressWidth) / 2;
  let bankAddressY = bankNameY;
  const addressHeight = doc.getTextDimensions(bankAddressLines).h;
  doc.text(bankAddressLines ?? "", bankAddressX, bankAddressY, {
    maxWidth: 100,
  });
  bankAddressY += addressHeight;

  // Phone number
  const bankPhoneNumberText = `Phone Number: ${
    barnchDtl?.branchPhoneNumber ?? ""
  }`;
  const bankPhoneNumberWidth =
    (doc.getStringUnitWidth(bankPhoneNumberText) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const bankPhoneNumberX = (pageWidth - bankPhoneNumberWidth) / 2;
  const bankPhoneNumberY = bankAddressY + 1;
  doc.text(bankPhoneNumberText ?? "", bankPhoneNumberX, bankPhoneNumberY);

  // IFSC Code
  const ifscCodeWidth =
    (doc.getStringUnitWidth(`IFSC Code: ${barnchDtl?.ifscCode ?? ""}`) *
      doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const ifscCodeX = (pageWidth - ifscCodeWidth) / 2;
  const ifscCodeY = bankPhoneNumberY + 3;
  doc.text(`IFSC Code: ${barnchDtl?.ifscCode ?? ""}`, ifscCodeX, ifscCodeY);

  // Draw a horizontal line
  const lineY = ifscCodeY + 4;
  const lineWidth = pageWidth - 20;
  const lineX = margin;
  doc.setLineWidth(0.5);
  doc.line(lineX, lineY, lineX + lineWidth, lineY);

  startY += 18;

  for (const section of data) {
    if (section?.DISPLAY_TYPE === "simple") {
      // Check if section has details
      if (section?.DETAILS && section?.DETAILS?.length > 0) {
        doc.setFontSize(8);

        const tableData: any = [];
        let leftData: any = [];
        let rightData: any = [];

        // Divide the data into left and right arrays
        for (let i = 0; i < section?.DETAILS?.length; i++) {
          if (i < section?.DETAILS.length / 2) {
            leftData.push(section.DETAILS[i]);
          } else {
            rightData.push(section.DETAILS[i]);
          }
        }

        // Apply toFixed for 'Limit' and 'Hold balance'
        const applyToFixed = (data) => {
          data.forEach((item) => {
            if (item?.LABEL === "Limit" || item?.LABEL === "Hold balance") {
              item.VALUE = item?.VALUE
                ? parseFloat(item?.VALUE).toFixed(2)
                : "";
            }
          });
        };

        // Apply the toFixed logic
        applyToFixed(leftData);
        applyToFixed(rightData);

        // Add empty values if left or right data is shorter
        const maxLength = Math.max(leftData.length, rightData.length);
        for (let i = leftData.length; i < maxLength; i++) {
          leftData.push({ LABEL: "", VALUE: "" });
        }
        for (let i = rightData.length; i < maxLength; i++) {
          rightData.push({ LABEL: "", VALUE: "" });
        }

        // Combine left and right data into tableData array
        for (let i = 0; i < maxLength; i++) {
          tableData.push([
            leftData[i].LABEL,
            leftData[i].VALUE,
            rightData[i].LABEL,
            rightData[i].VALUE,
          ]);
        }

        // Account details and branch details table
        doc.autoTable({
          startY,
          head: [[{ content: section?.TITLE, colSpan: 4 }]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: rgbColor,
            textColor: [255, 255, 255],
            fontSize: 8,
            halign: "center",
          },
          didParseCell: (data) => {
            const rowData = data.row.cells;
            const columnIndex = data.column.index;
            if (rowData) {
              // Apply alignment for Limit and Hold balance
              if (columnIndex === 1 && rowData[0]?.raw === "Limit") {
                data.cell.styles.halign = "right";
              } else if (
                columnIndex === 3 &&
                rowData[2]?.raw === "Hold balance"
              ) {
                data.cell.styles.halign = "right";
              }
            }
          },
          styles: { fontSize: 8 },
        });

        // Update the startY position based on the table height
        const tableHeight = doc.previousAutoTable.finalY - startY;
        startY += tableHeight + 5;
      }
    } else if (section?.DISPLAY_TYPE === "grid") {
      startY += 2;

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");

      // Calculate the width of the title and statementPeriod
      const titleWidth =
        (doc.getStringUnitWidth(section?.TITLE ?? "") *
          doc.internal.getFontSize()) /
        doc.internal.scaleFactor;

      const periodWidth =
        (doc.getStringUnitWidth(acctDtl?.statementPeriod ?? "") *
          doc.internal.getFontSize()) /
        doc.internal.scaleFactor;

      // Define the horizontal space between the two
      const spaceBetween = 1;
      // Calculate the positions for the title and statementPeriod
      const titleX = (pageWidth - titleWidth - periodWidth - spaceBetween) / 2;
      const periodX = titleX + titleWidth + spaceBetween;
      const textY = startY;

      // Draw both texts horizontally on the same line
      doc.text(titleX, textY, section?.TITLE ?? "");
      doc.text(periodX, textY, acctDtl?.statementPeriod ?? "");

      startY += 2;
      // const tableHeaders = section?.METADATA.map((item) => item?.LABEL);

      let tableHeaders = section?.METADATA.map((item) => item?.LABEL);
      tableHeaders = tableHeaders.map((header) => {
        if (header === "Tr. Branch") {
          return "Tr.\nBranch";
        }
        return header;
      });

      section?.DATA?.forEach((item) => {
        item.DR_AMT = item.DR_AMT ? parseFloat(item.DR_AMT).toFixed(2) : "";
        item.CR_AMT = item.CR_AMT ? parseFloat(item.CR_AMT).toFixed(2) : "";
        item.CL_BAL = item.CL_BAL ? parseFloat(item.CL_BAL).toFixed(2) : "";
      });

      const tableData = section?.DATA?.map((item) => {
        const rowData: any = [];

        // Check if DATA is empty
        if (section?.DATA?.length === 0) {
          rowData.push("Data not found");
        } else {
          section?.METADATA?.forEach((column) => {
            const accessor = column?.ACCESSOR;
            let value = item[accessor];
            if (accessor === "VALUE_DT" || accessor === "TRN_DATE") {
              value = new Date(value);
              const formattedDate = value.toLocaleDateString("en-GB"); // Format as dd/MM/yyyy
              rowData.push(formattedDate);
            } else {
              rowData.push(value);
            }
          });
        }

        return rowData;
      });

      // Account statement table
      const columnWidths = [
        { index: 0, widthPercent: 0.1, alignment: "center" },
        { index: 1, widthPercent: 0.19, alignment: "left" },
        { index: 2, widthPercent: 0.08, alignment: "right" },
        { index: 3, widthPercent: 0.1, alignment: "center" },
        { index: 4, widthPercent: 0.15, alignment: "right" },
        { index: 5, widthPercent: 0.15, alignment: "right" },
        { index: 6, widthPercent: 0.15, alignment: "right" },
        { index: 7, widthPercent: 0.08, alignment: "left" },
      ];

      const columnStyles = columnWidths?.reduce((styles, column) => {
        styles[column.index] = {
          cellWidth: column?.widthPercent * (pageWidth - 28.25), // Calculate width based on percentage
          halign: column?.alignment, // Set alignment (left, right, or center)
        };
        return styles;
      }, {});

      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: startY,
        headStyles: {
          fillColor: rgbColor,
          textColor: [255, 255, 255],
          fontSize: 8,
        },
        styles: {
          fontSize: 8,
        },
        columnStyles: columnStyles,
        didParseCell: (data) => {
          // Check if the cell is a header cell
          if (data.row.section === "head") {
            // Set different alignments for each header based on the column index
            const column = columnWidths.find(
              (col) => col.index === data.column.index
            );
            if (column) {
              data.cell.styles.halign = column.alignment; // Set header alignment
            }
          }
        },
        didDrawPage: (data) => {
          startY = data.cursor.y + spacing;
          if (data?.pageNumber > 1) {
            textForAllPage();
          }
        },
      });
      const totalPages = doc.internal.getNumberOfPages();
      // Loop through all pages and add the page number and header text
      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page); // Set the current page

        // Page number setup
        const currentPage = page;
        const pageNumberText = `${currentPage} of ${totalPages}`;
        const pageNumberWidth = doc.getTextWidth(pageNumberText); // Get width of page number text

        // Header text setup
        const headerText = `Generated On: ${format(
          new Date(),
          "dd/MM/yyyy HH:mm:ss"
        )} / Generated By: ${generatedBy} / From Branch: ${RequestingBranchCode}`;
        const headerLines = doc.splitTextToSize(headerText, pageWidth - 20); // Split text if it's too long

        // Left side header text
        doc.setFontSize(6);
        doc.setTextColor(80);
        doc.text(headerLines, 10, pageHeight - 5);

        // Right side page number
        const pageNumberX = pageWidth - 10 - pageNumberWidth; // Position page number on the right
        doc.text(pageNumberText, pageNumberX, pageHeight - 5);
      }
    } else if (section?.DISPLAY_TYPE === "simpleGrid") {
      // Check if section has details
      if (section?.DETAILS && section?.DETAILS.length > 0) {
        doc.setFontSize(8);

        const tableData: any = [];
        let leftData: any = [];
        let rightData: any = [];

        // Divide the data into left and right arrays
        for (let i = 0; i < section?.DETAILS.length; i++) {
          if (i < section?.DETAILS.length / 2) {
            leftData.push(section.DETAILS[i]);
          } else {
            rightData.push(section.DETAILS[i]);
          }
        }

        // Add empty values if left or right data is shorter
        const maxLength = Math.max(leftData.length, rightData.length);
        for (let i = leftData.length; i < maxLength; i++) {
          leftData.push({ LABEL: "", VALUE: "" });
        }
        for (let i = rightData.length; i < maxLength; i++) {
          rightData.push({ LABEL: "", VALUE: "" });
        }

        const formatLabels = [
          "Total Withdrawable Balance",
          "Closing Balance",
          "Credit Amount",
          "Debit Amount",
          "Opening Balance",
        ];

        // Function to apply toFixed() for specific labels
        function applyToFixed(data) {
          data.forEach((item) => {
            if (formatLabels.includes(item.LABEL) && item.VALUE !== "") {
              const value = parseFloat(item.VALUE);
              if (!isNaN(value)) {
                item.VALUE = value.toFixed(2);
              }
            }
          });
        }

        applyToFixed(leftData);
        applyToFixed(rightData);

        // Combine left and right data into tableData array
        for (let i = 0; i < maxLength; i++) {
          tableData.push([
            leftData[i].LABEL,
            leftData[i].VALUE,
            rightData[i].LABEL,
            rightData[i].VALUE,
          ]);
        }

        // Statement summary table
        doc.autoTable({
          startY,
          head: [[{ content: section?.TITLE, colSpan: 4 }]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: rgbColor,
            textColor: [255, 255, 255],
            fontSize: 8,
            halign: "center",
          },
          didParseCell: (data) => {
            const columnIndex = data.column.index;
            if (columnIndex === 1 || columnIndex === 3) {
              data.cell.styles.halign = "right";
            }
          },
          styles: { fontSize: 8 },
        });

        // Update the startY position based on the table height
        const tableHeight = doc.previousAutoTable.finalY - startY;
        startY += tableHeight + 5;
      }
    } else if (section?.DISPLAY_TYPE === "OnlyExport") {
      doc.setFontSize(12);
      doc.text(`---------: ${section?.TITLE} :--------`, 10, startY);
      startY += 10;

      doc.setFontSize(10);

      const mappedData = section?.DETAILS?.map((item) => item.VALUE); // Extract the VALUE property
      const formattedData = mappedData.join("\n"); // Join the values with newline separator

      // If this is not the first "onlyExport" section, add spacing between previous and current section
      if (exportContentStartY !== 0) {
        startY += spacing;
      }

      const maxWidth = pageWidth - 10; // Adjust the maximum width as needed
      const lines = doc.splitTextToSize(formattedData, maxWidth);

      addTextWithPageBreak(doc, lines, startY);

      startY += lines.length * 5; // Adjust the vertical position based on the number of lines
      exportContentStartY = startY; // Update the starting Y position for the next "onlyExport" content
    }
  }
  // startY += 10;
  doc.setFontSize(12);

  addTextWithPageBreak(
    doc,
    "********************************************** END OF STATEMENT *******************************************",
    startY
  );

  if (print) {
    const pdfData = doc.output("bloburl");
    const iframe: any = document.createElement("iframe");
    iframe.src = pdfData;
    iframe.id = "printFrame";
    iframe.name = "printFrame";
    iframe.title = "printFrame";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    setTimeout(() => {
      window.frames["printFrame"].print();
    }, 50);
  } else {
    // doc.save("Statement Of Account.pdf");
    doc.save(
      `${acctDtl?.accountNumber?.trim() ?? ""}_SOA_${
        acctDtl?.statementPeriod ?? ""
      }.pdf`
    );
  }
};

export default exportToPDF;
