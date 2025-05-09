import { Student } from "@/lib/context";
import { CellConfig } from "jspdf";

type FiltersReportProps = {
  data: Student[];
  name: string;
  code: string;
  description: string;
};

const FieldMap: Record<string, keyof Student> = {
  Nome: "name",
  Turma: "schoolYear",
  Turno: "shift",
  Responsável: "guardian",
  "Data de Nascimento": "birthDate",
};

export const generateReport = async ({
  data,
  name,
  code,
  description,
}: FiltersReportProps) => {
  const dataMap = data.map((s) => {
    let mappedData = {};
    for (const [map, field] of Object.entries(FieldMap)) {
      mappedData = { ...mappedData, [map]: s[field] };
    }

    return mappedData;
  });

  const createHeaders = (): CellConfig[] => {
    const headers: CellConfig[] = [];
    for (const [header, _] of Object.entries(FieldMap)) {
      headers.push({
        name: header,
        prompt: header,
        width: 65,
        align: "center",
        padding: 0,
      } as CellConfig);
    }

    return headers;
  };

  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight() + 5;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 10;

    let yPos = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${name}`, margin, yPos);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    yPos += 6;
    doc.text(`Código do Relatório: REL-${code}`, margin, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.text(`${description}`, margin, yPos);
    yPos += 6;

    let xPos = yPos;

    const headers = createHeaders();

    let usagePageSpace = margin;
    let pageNumber = 1;
    const batchPageData: Record<number, {}[]> = {};
    dataMap.map((data) => {
      const pageN = Number(pageNumber);

      const currentRowContent = Object.entries(data).map(([, value]) => {
        const lines = doc.splitTextToSize(`${value}`, pageWidth);
        return lines.length;
      });

      const rowHeight = currentRowContent[0] * lineHeight;
      if (
        usagePageSpace > pageHeight - margin ||
        (batchPageData[pageN] && batchPageData[pageN].length === 9)
      ) {
        pageNumber++;
        usagePageSpace = margin;
      } else {
        if (!batchPageData[pageN]) {
          batchPageData[pageN] = [data];
        } else if (batchPageData[pageN]) {
          batchPageData[pageN].push(data);
        }

        usagePageSpace += rowHeight;
      }
    });

    for (const [pageN, data] of Object.entries(batchPageData)) {
      const totalPages = Object.entries(batchPageData).length;
      const pageNumber = Number(pageN);

      doc.text(`Página ${pageNumber} de ${totalPages} - Listando ${data.length} items`, margin, yPos);
      yPos += 10;
      doc.table(xPos, yPos, data, headers, {});

      doc.addPage();
      yPos = margin;
    }

    doc.save(`REL_${code}`);
  } catch (error) {
    console.error(error);
  }
};
