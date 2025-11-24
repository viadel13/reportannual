"use client"

import React, { useState } from 'react';
import { CalendarToday, TrendingUp, Description, ExpandMore, PictureAsPdf, TableView } from '@mui/icons-material';
import { TextField, Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function Home() {
  const [currentYear] = useState(new Date().getFullYear());
  
  // Données mensuelles avec EC, ER et IR pour chaque mois
  const [monthlyData, setMonthlyData] = useState<any>({
    janvier: { ec: '', er: '639550', ir: '12000' },
    fevrier: { ec: '', er: '166000', ir: '20000' },
    mars: { ec: '', er: '232600', ir: '27000' },
    avril: { ec: '', er: '249950', ir: '30000' },
    mai: { ec: '', er: '377000', ir: '35000' },
    juin: { ec: '', er: '271500', ir: '37000' },
    juillet: { ec: '', er: '183000', ir: '28000' },
    aout: { ec: '', er: '134800', ir: '37000' },
    septembre: { ec: '', er: '237300', ir: '36000' },
    octobre: { ec: '', er: '320500', ir: '9000' }
  });
  
  // État pour gérer l'ouverture/fermeture des collapses
  const [expandedMonths, setExpandedMonths] = useState<any>({});
  
  const [showRecap, setShowRecap] = useState(false);

  const mois = [
    'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'aout', 'septembre', 'octobre'
  ];

  const moisLabels = [
    'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE'
  ];

  const handleMonthlyChange = (month:any, field:any, value:any) => {
    setMonthlyData((prev: any) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: value
      }
    }));
  };

  const toggleExpand = (month: any) => {
    setExpandedMonths((prev:any) => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const handleSubmit = () => {
    const allMonthsFilled = mois.every(m => monthlyData[m].ec);
    if (allMonthsFilled) {
      setShowRecap(true);
    } else {
      alert('Veuillez remplir l\'Épargne Client (EC) pour tous les mois de janvier à octobre');
    }
  };

  const calculateResults = () => {
    const results: any[] = [];

    let TR_prev = 0;
    let CC_prev = 0;

    mois.forEach((month, index) => {
      // On récupère toujours la partie entière
      const EC = Math.floor(parseFloat(monthlyData[month].ec) || 0);
      const ER = Math.floor(parseFloat(monthlyData[month].er) || 0);
      const IR = Math.floor(parseFloat(monthlyData[month].ir) || 0);

      let TR, IC, CC;
      let formuleTR, formuleIC, formuleCC;

      if (index === 0) {
        // JANVIER
        TR = ER;
        IC = Math.floor((EC * IR) / TR);

        const nextEC = Math.floor(parseFloat(monthlyData[mois[1]].ec) || 0);
        CC = Math.floor(EC + IC + nextEC);

        formuleTR = `ER${moisLabels[0]} = ${ER}`;
        formuleIC = `(EC${moisLabels[0]} × IR${moisLabels[0]}) ÷ TR${moisLabels[0]} = (${EC} × ${IR}) ÷ ${TR}`;
        formuleCC = `EC${moisLabels[0]} + IC${moisLabels[0]} + EC${moisLabels[1]} = ${EC} + ${IC} + ${nextEC}`;
      } else {
        const IR_prev = Math.floor(parseFloat(monthlyData[mois[index - 1]].ir) || 0);

        TR = Math.floor(TR_prev + IR_prev + ER);

        IC = Math.floor((CC_prev * IR) / TR);

        const nextEC = index < 9 ? Math.floor(parseFloat(monthlyData[mois[index + 1]].ec) || 0) : 0;

        CC = Math.floor(CC_prev + IC + nextEC);

        formuleTR = `TR${moisLabels[index - 1]} + IR${moisLabels[index - 1]} + ER${moisLabels[index]} = ${TR_prev} + ${IR_prev} + ${ER}`;
        formuleIC = `(CC${moisLabels[index - 1]} × IR${moisLabels[index]}) ÷ TR${moisLabels[index]} = (${CC_prev} × ${IR}) ÷ ${TR}`;
        formuleCC =
            index < 9
                ? `CC${moisLabels[index - 1]} + IC${moisLabels[index]} + EC${moisLabels[index + 1]} = ${CC_prev} + ${IC} + ${nextEC}`
                : `CC${moisLabels[index - 1]} + IC${moisLabels[index]} = ${CC_prev} + ${IC}`;
      }

      // Ajout dans la liste des résultats
      results.push({
        mois: moisLabels[index],
        ER: ER.toString(),
        IR: IR.toString(),
        TR: TR.toString(),
        EC: EC.toString(),
        IC: IC.toString(),
        CC: CC.toString(),
        formules: {
          TR: formuleTR,
          IC: formuleIC,
          CC: formuleCC
        }
      });

      // Mise à jour pour le mois suivant
      TR_prev = TR;
      CC_prev = CC;
    });

    return results;
  };

  const results = calculateResults();
  const totalEpargneClient = mois.reduce((sum, m) => sum + (parseInt(monthlyData[m].ec) || 0), 0);
  const totalInterets = results.reduce((sum, row) => sum + parseFloat(row.IC), 0);
  const capitalFinal = results[results.length - 1]?.CC || '0';

  const exportToPDF = async () => {
    const [jsPDFImport, autoTableModule]: any = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'),
      import('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.js')
    ]);

    const jsPDFConstructor = jsPDFImport.jsPDF || jsPDFImport.default?.jsPDF || jsPDFImport.default || jsPDFImport;
    const doc = new jsPDFConstructor();

    doc.setFontSize(16);
    doc.text(`Bilan Financier Annuel – Année ${currentYear}`, 14, 18);

    doc.setFontSize(12);
    doc.text(`Total Épargne Client : ${totalEpargneClient.toFixed(0)} FRCFA`, 14, 30);
    doc.text(`Capital Final (CC) : ${capitalFinal} FRCFA`, 14, 38);
    doc.text(`Intérêts Totaux (IC) : ${totalInterets.toFixed(0)} FRCFA`, 14, 46);

    const head = [['DATE', 'ER', 'IR', 'TR', 'EC', 'IC', 'CC']];
    const body = results.flatMap((row: any) => [
      [
        row.mois,
        `${row.ER} FRCFA`,
        `${row.IR} FRCFA`,
        `${row.TR} FRCFA`,
        `${row.EC} FRCFA`,
        `${row.IC} FRCFA`,
        `${row.CC} FRCFA`
      ],
      ['Formule', '-', '-', row.formules.TR, '-', row.formules.IC, row.formules.CC]
    ]);

    const autoTable = autoTableModule.default || autoTableModule.autoTable || autoTableModule;

    autoTable(doc, {
      head,
      body,
      startY: 54,
      styles: { halign: 'right', cellPadding: 3, fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold', halign: 'right' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      bodyStyles: { textColor: [51, 51, 51] },
      didParseCell: (data: any) => {
        if (data.section === 'body' && data.row.raw[0] === 'Formule') {
          data.cell.styles.fontStyle = 'italic';
          data.cell.styles.fontSize = 9;
          data.cell.styles.textColor = [102, 102, 102];
          data.cell.styles.halign = data.column.index === 0 ? 'left' : 'right';
          data.cell.styles.fillColor = [255, 253, 231];
        }
      }
    });

    doc.save(`bilan-financier-${currentYear}.pdf`);
  };

  const exportToExcel = async () => {
    const [xlsxImport, fileSaverModule]: any = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm'),
      import('https://cdn.jsdelivr.net/npm/file-saver@2.0.5/+esm')
    ]);

    const XLSXModule = xlsxImport.default || xlsxImport;

    const worksheetData = [
      ['DATE', 'ER', 'IR', 'TR', 'EC', 'IC', 'CC'],
      ...results.flatMap((row: any) => [
        [
          row.mois,
          `${row.ER} FRCFA`,
          `${row.IR} FRCFA`,
          `${row.TR} FRCFA`,
          `${row.EC} FRCFA`,
          `${row.IC} FRCFA`,
          `${row.CC} FRCFA`
        ],
        ['Formule', '-', '-', row.formules.TR, '-', row.formules.IC, row.formules.CC]
      ])
    ];

    const worksheet = XLSXModule.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 24 },
      { wch: 16 },
      { wch: 32 },
      { wch: 32 }
    ];

    const workbook = XLSXModule.utils.book_new();
    XLSXModule.utils.book_append_sheet(workbook, worksheet, 'Bilan Annuel');

    const excelBuffer = XLSXModule.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const saveAs = fileSaverModule.saveAs || fileSaverModule.default;
    saveAs(blob, `bilan-financier-${currentYear}.xlsx`);
  };


  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #e0f2f1, #bbdefb)', padding: 1 }}>
      <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Paper sx={{ padding: 1, marginBottom: 4, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ fontSize: 36, color: '#4caf50', marginRight: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Bilan Financier Annuel
                </Typography>
                <Typography variant="body1" sx={{ color: '#777' }}>
                  Année {currentYear}
                </Typography>
              </Box>
            </Box>
            <TrendingUp sx={{ fontSize: 48, color: '#388e3c' }} />
          </Box>
        </Paper>

        {!showRecap ? (
          <Box>
            {/* Section mensuelle avec paramètres ER et IR en collapse */}
            <Paper sx={{ padding: 1, marginBottom: 4, boxShadow: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3 }}>
                Saisie Mensuelle (Janvier à Octobre)
              </Typography>
              
              <Grid container spacing={3}>
                {mois.map((month, idx) => (
                  <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={month}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        padding: 2, 
                        backgroundColor: '#f5f5f5',
                        border: '2px solid #e0e0e0',
                        borderRadius: 2
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: '#1976d2', 
                          marginBottom: 2,
                          textAlign: 'center'
                        }}
                      >
                        {moisLabels[idx]}
                      </Typography>
                      
                      {/* Épargne Client (principal) */}
                      <TextField
                        label="Épargne Client (EC)"
                        type="number"
                        fullWidth
                        size="small"
                        value={monthlyData[month].ec}
                        onChange={(e) => handleMonthlyChange(month, 'ec', e.target.value)}
                        placeholder="FRCFA"
                        variant="outlined"
                        sx={{ marginBottom: 1 }}
                      />
                      
                      {/* Bouton pour afficher/masquer ER et IR */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 1 }}>
                        <Button
                          size="small"
                          onClick={() => toggleExpand(month)}
                          endIcon={
                            <ExpandMore 
                              sx={{ 
                                transform: expandedMonths[month] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: '0.3s'
                              }} 
                            />
                          }
                          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                        >
                          Paramètres ER & IR
                        </Button>
                      </Box>
                      
                      {/* Collapse pour ER et IR */}
                      <Collapse in={expandedMonths[month]} timeout="auto">
                        <Box sx={{ padding: 1, backgroundColor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                          <TextField
                            label="Épargne Réunion (ER)"
                            type="number"
                            fullWidth
                            size="small"
                            value={monthlyData[month].er}
                            onChange={(e) => handleMonthlyChange(month, 'er', e.target.value)}
                            placeholder="FRCFA"
                            variant="outlined"
                            sx={{ marginBottom: 1 }}
                          />
                          <TextField
                            label="Intérêt Réunion (IR)"
                            type="number"
                            fullWidth
                            size="small"
                            value={monthlyData[month].ir}
                            onChange={(e) => handleMonthlyChange(month, 'ir', e.target.value)}
                            placeholder="FRCFA"
                            variant="outlined"
                          />
                          <Typography variant="caption" sx={{ display: 'block', marginTop: 1, color: '#666' }}>
                            Valeurs par défaut: ER={monthlyData[month].er}, IR={monthlyData[month].ir}
                          </Typography>
                        </Box>
                      </Collapse>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Légende */}
            <Paper sx={{ padding: 1, marginBottom: 4, backgroundColor: '#fff9c4', boxShadow: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                📖 Légende des Abréviations
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs: 6, sm: 4, md: 2}}>
                  <Typography variant="body2"><strong>TR:</strong> Total Réunion</Typography>
                </Grid>
                <Grid size={{xs: 6, sm: 4, md: 2}}>
                  <Typography variant="body2"><strong>CC:</strong> Capital Client</Typography>
                </Grid>
                <Grid size={{xs: 6, sm: 4, md: 2}}>
                  <Typography variant="body2"><strong>IR:</strong> Intérêt Réunion</Typography>
                </Grid>
                <Grid size={{xs: 6, sm: 4, md: 2}}>
                  <Typography variant="body2"><strong>IC:</strong> Intérêt Client</Typography>
                </Grid>
                <Grid size={{xs: 6, sm: 4, md: 2}}>
                  <Typography variant="body2"><strong>EC:</strong> Épargne Client</Typography>
                </Grid>
                <Grid size={{xs: 6, sm: 4, md: 2}}>
                  <Typography variant="body2"><strong>ER:</strong> Épargne Réunion</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
              startIcon={<Description />}
            >
              Générer le Récapitulatif Annuel
            </Button>
          </Box>
        ) : (
          <Paper sx={{ padding: 1, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', rowGap: 2, justifyContent: 'space-between', marginBottom: 4, flexDirection: {xs: "column", sm: "column", md: "row"}, alignItems:{xs: "flex-start", sm: "flex-start", md: "none"} }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                📊 Récapitulatif Annuel {currentYear}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button onClick={exportToPDF} variant="contained" color="primary" startIcon={<PictureAsPdf />}>
                  Exporter en PDF
                </Button>
                <Button onClick={exportToExcel} variant="outlined" color="primary" startIcon={<TableView />}>
                  Exporter en Excel
                </Button>
                <Button onClick={() => setShowRecap(false)} variant="outlined" color="secondary">
                  Modifier
                </Button>
              </Box>
            </Box>

            {/* Résumé global */}
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Paper sx={{ padding: 2, backgroundColor: '#f3e5f5', boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Total Épargne Client</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    {totalEpargneClient.toFixed(0)} FRCFA
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Paper sx={{ padding: 2, backgroundColor: '#e3f2fd', boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Capital Final (CC)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                    {capitalFinal} FRCFA
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Paper sx={{ padding: 2, backgroundColor: '#c8e6c9', boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Intérêts Totaux (IC)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                    {totalInterets.toFixed(0)} FRCFA
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Tableau détaillé avec formules */}
            <TableContainer component={Paper} sx={{ marginBottom: 4, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1976d2' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>DATE</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">ER</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">IR</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">TR</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">EC</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">IC</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">CC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((row, index) => (
                    <React.Fragment key={index}>
                      {/* Ligne des valeurs */}
                      <TableRow sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{row.mois}</TableCell>
                        <TableCell align="right" sx={{ color: '#1976d2', fontWeight: 'bold' }}>{row.ER} FRCFA</TableCell>
                        <TableCell align="right" sx={{ color: '#388e3c', fontWeight: 'bold' }}>{row.IR} FRCFA</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', color: '#1565c0' }}>{row.TR} FRCFA</TableCell>
                        <TableCell align="right" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>{row.EC} FRCFA</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: '#fff3e0', fontWeight: 'bold', color: '#e65100' }}>{row.IC} FRCFA</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: '#f3e5f5', fontWeight: 'bold', color: '#6a1b9a' }}>{row.CC} FRCFA</TableCell>
                      </TableRow>

                      {/* Ligne des formules */}
                      <TableRow sx={{ backgroundColor: '#fffde7' }}>
                        <TableCell sx={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>Formule:</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#666' }}>-</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#666' }}>-</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#1565c0', fontFamily: 'monospace' }}>
                          {row.formules.TR}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#666' }}>-</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#e65100', fontFamily: 'monospace' }}>
                          {row.formules.IC}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#6a1b9a', fontFamily: 'monospace' }}>
                          {row.formules.CC}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Explication des formules */}
            <Paper sx={{ padding: 3, backgroundColor: '#e8f5e9', border: '2px solid #4caf50' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2e7d32' }}>
                📐 Explication des Formules Utilisées
              </Typography>
              <Box sx={{ marginLeft: 2 }}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  <strong style={{ color: '#1565c0' }}>Total Réunion (TR):</strong>
                  <br />• Janvier: TR = ER du mois
                  <br />• Autres mois: TR = TR(mois précédent) + IR(mois précédent) + ER(mois actuel)
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  <strong style={{ color: '#e65100' }}>Intérêt Client (IC):</strong>
                  <br />• Janvier: IC = (EC × IR du mois) ÷ TR
                  <br />• Autres mois: IC = (CC du mois précédent × IR du mois) ÷ TR
                </Typography>
                <Typography variant="body2">
                  <strong style={{ color: '#6a1b9a' }}>Capital Client (CC):</strong>
                  <br />• Janvier à Septembre: CC = CC(mois précédent) + IC(mois actuel) + EC(mois suivant)
                  <br />• Octobre: CC = CC(septembre) + IC(octobre)
                </Typography>
              </Box>
            </Paper>
          </Paper>
          )}
        </Box>
      </Box>
    );
}
