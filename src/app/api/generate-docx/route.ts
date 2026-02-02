import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { data, year } = await request.json();

    // Importer dynamiquement les modules nécessaires
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      Table,
      TableRow,
      TableCell,
      AlignmentType,
      WidthType,
      ShadingType,
      BorderStyle,
      HeadingLevel,
    } = await import("docx");

    const { results, totalEC, finalCC, totalIC } = data;

    // Configuration des bordures
    const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const borders = {
      top: border,
      bottom: border,
      left: border,
      right: border,
    };

    // Créer les lignes du tableau
    const tableRows = [
      // En-tête du tableau
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "DATE",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "ER",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "IR",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "TR",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "EC",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "IC",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 1337, type: WidthType.DXA },
            shading: { fill: "1976D2", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "CC",
                    bold: true,
                    color: "FFFFFF",
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];

    // Ajouter les lignes de données
    results.forEach((row: any, index: number) => {
      const bgColor = index % 2 === 0 ? "F5F5F5" : "FFFFFF";
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: bgColor, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: row.mois, bold: true, size: 20 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: bgColor, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: `${row.ER} FRCFA`, size: 20 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: bgColor, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: `${row.IR} FRCFA`, size: 20 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: "E3F2FD", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${row.TR} FRCFA`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: bgColor, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: `${row.EC} FRCFA`, size: 20 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: "FFF3E0", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${row.IC} FRCFA`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 1337, type: WidthType.DXA },
              shading: { fill: "F3E5F5", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${row.CC} FRCFA`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      );
    });

    // Création du document
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Arial", size: 24 },
          },
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { size: 32, bold: true, font: "Arial", color: "1976D2" },
            paragraph: {
              spacing: { before: 240, after: 240 },
              outlineLevel: 0,
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { size: 28, bold: true, font: "Arial", color: "333333" },
            paragraph: {
              spacing: { before: 180, after: 180 },
              outlineLevel: 1,
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 12240,
                height: 15840,
              },
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: [
            // Titre principal
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [
                new TextRun({ text: `Bilan Financier Annuel ${year}` }),
              ],
            }),

            // Ligne de séparation
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [
                new TextRun({ text: "━".repeat(50), color: "CCCCCC" }),
              ],
            }),

            // Section Résumé Global
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 300 },
              children: [new TextRun({ text: "📊 Résumé Global" })],
            }),

            // Tableau résumé
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnWidths: [4680, 4680],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      borders,
                      width: { size: 4680, type: WidthType.DXA },
                      shading: { fill: "F3E5F5", type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 180, right: 180 },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Total Épargne Client",
                              size: 22,
                            }),
                          ],
                        }),
                        new Paragraph({
                          spacing: { before: 100 },
                          children: [
                            new TextRun({
                              text: `${totalEC} FRCFA`,
                              bold: true,
                              size: 28,
                              color: "9C27B0",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      borders,
                      width: { size: 4680, type: WidthType.DXA },
                      shading: { fill: "E3F2FD", type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 180, right: 180 },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Capital Final (CC)",
                              size: 22,
                            }),
                          ],
                        }),
                        new Paragraph({
                          spacing: { before: 100 },
                          children: [
                            new TextRun({
                              text: `${finalCC} FRCFA`,
                              bold: true,
                              size: 28,
                              color: "2196F3",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      borders,
                      width: { size: 4680, type: WidthType.DXA },
                      shading: { fill: "C8E6C9", type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 180, right: 180 },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Intérêts Totaux (IC)",
                              size: 22,
                            }),
                          ],
                        }),
                        new Paragraph({
                          spacing: { before: 100 },
                          children: [
                            new TextRun({
                              text: `${totalIC} FRCFA`,
                              bold: true,
                              size: 28,
                              color: "388E3C",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      borders,
                      width: { size: 4680, type: WidthType.DXA },
                      shading: { fill: "FFF9C4", type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 180, right: 180 },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Période", size: 22 }),
                          ],
                        }),
                        new Paragraph({
                          spacing: { before: 100 },
                          children: [
                            new TextRun({
                              text: "Janvier - Octobre",
                              bold: true,
                              size: 28,
                              color: "F57C00",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // Espacement
            new Paragraph({
              spacing: { before: 400, after: 300 },
              children: [new TextRun({ text: "" })],
            }),

            // Section Détails Mensuels
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 300 },
              children: [new TextRun({ text: "📅 Détails Mensuels" })],
            }),

            // Tableau principal
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnWidths: [1337, 1337, 1337, 1337, 1337, 1337, 1337],
              rows: tableRows,
            }),

            // Espacement
            new Paragraph({
              spacing: { before: 400, after: 200 },
              children: [new TextRun({ text: "" })],
            }),

            // Légende
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
              children: [new TextRun({ text: "📖 Légende des Abréviations" })],
            }),

            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun({ text: "TR: ", bold: true }),
                new TextRun({ text: "Total Réunion" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun({ text: "CC: ", bold: true }),
                new TextRun({ text: "Capital Client" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun({ text: "IR: ", bold: true }),
                new TextRun({ text: "Intérêt Réunion" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun({ text: "IC: ", bold: true }),
                new TextRun({ text: "Intérêt Client" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun({ text: "EC: ", bold: true }),
                new TextRun({ text: "Épargne Client" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "• ", bold: true }),
                new TextRun({ text: "ER: ", bold: true }),
                new TextRun({ text: "Épargne Réunion" }),
              ],
            }),

            // Pied de page
            new Paragraph({
              spacing: { before: 400 },
              children: [new TextRun({ text: "" })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 200 },
              children: [
                new TextRun({
                  text: `Document généré le ${new Date().toLocaleDateString("fr-FR")}`,
                  size: 18,
                  color: "999999",
                  italics: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Générer le buffer
    const buffer = await Packer.toBuffer(doc);

    // Convertir le Buffer Node.js en Uint8Array pour Next.js
    const uint8Array = new Uint8Array(buffer);

    // Retourner le fichier
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Bilan_Financier_${year}.docx"`,
      },
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération du document",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
