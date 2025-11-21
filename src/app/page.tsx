"use client"

import React, { useState } from 'react';
import { CalendarToday, TrendingUp, AttachMoney, Description } from '@mui/icons-material';
import { TextField, Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function Home() {
  const [currentYear] = useState(new Date().getFullYear());
  const [epargneReunion, setEpargneReunion] = useState('');
  const [interetReunion, setInteretReunion] = useState('');
  const [monthlyData, setMonthlyData] = useState<Record<string, string>>({
    janvier: '', fevrier: '', mars: '', avril: '', mai: '', juin: '',
    juillet: '', aout: '', septembre: '', octobre: ''
  });
  const [showRecap, setShowRecap] = useState(false);

  const mois = [
    'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'aout', 'septembre', 'octobre'
  ];

  const moisLabels = [
    'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE'
  ];

  const handleMonthlyChange = (month: keyof typeof monthlyData, value:string) => {
    setMonthlyData(prev => ({
      ...prev,
      [month]: value
    }));
  };

  const handleSubmit = () => {
    if (epargneReunion && interetReunion && monthlyData.janvier) {
      const allMonthsFilled = mois.every(m => monthlyData[m]);
      if (allMonthsFilled) {
        setShowRecap(true);
      } else {
        alert('Veuillez remplir tous les mois de janvier à octobre');
      }
    } else {
      alert('Veuillez remplir tous les champs de janvier');
    }
  };

  const calculateResults = () => {
    const results: any[] = [];
    const ER = Math.floor(parseFloat(epargneReunion) || 0); // Only consider the integer part
    const IR = Math.floor(parseFloat(interetReunion) || 0); // Only consider the integer part

    const allEC = mois.map(m => Math.floor(parseFloat(monthlyData[m]) || 0)); // Only consider the integer part

    let TR_prev = 0;
    let CC_prev = 0;

    mois.forEach((month, index) => {
      const EC = allEC[index];
      let TR, IC, CC;
      let formuleTR, formuleIC, formuleCC;

      if (index === 0) {
        // JANVIER
        TR = ER;
        IC = (EC * IR) / TR;
        CC = EC + IC + allEC[1];

        formuleTR = `ER = ${ER.toFixed(0)} FRCFA`;
        formuleIC = `(EC${moisLabels[0]} × IR${moisLabels[0]}) ÷ TR${moisLabels[0]} = (${EC.toFixed(0)} × ${IR.toFixed(0)}) ÷ ${TR.toFixed(0)}`;
        formuleCC = `EC${moisLabels[0]} + IC${moisLabels[0]} + EC${moisLabels[1]} = ${EC.toFixed(0)} + ${IC.toFixed(0)} + ${allEC[1].toFixed(0)}`;
      } else {
        // FEVRIER à OCTOBRE
        TR = TR_prev + IR + ER;
        IC = (CC_prev * IR) / TR;
        const nextEC = index < 9 ? allEC[index + 1] : 0;
        CC = CC_prev + IC + nextEC;

        formuleTR = `TR${moisLabels[index-1]} + IR${moisLabels[index-1]} + ER${moisLabels[index]} = ${TR_prev.toFixed(0)} + ${IR.toFixed(0)} + ${ER.toFixed(0)}`;
        formuleIC = `(CC${moisLabels[index-1]} × IR${moisLabels[index]}) ÷ TR${moisLabels[index]} = (${CC_prev.toFixed(0)} × ${IR.toFixed(0)}) ÷ ${TR.toFixed(0)}`;

        if (index < 9) {
          formuleCC = `CC${moisLabels[index-1]} + IC${moisLabels[index]} + EC${moisLabels[index+1]} = ${CC_prev.toFixed(0)} + ${IC.toFixed(0)} + ${nextEC.toFixed(0)}`;
        } else {
          formuleCC = `CC${moisLabels[index-1]} + IC${moisLabels[index]} = ${CC_prev.toFixed(0)} + ${IC.toFixed(0)}`;
        }
      }

      results.push({
        mois: moisLabels[index],
        ER: ER.toFixed(0),
        IR: IR.toFixed(0),
        TR: TR.toFixed(0),
        EC: EC.toFixed(0),
        IC: IC.toFixed(0),
        CC: CC.toFixed(0),
        formules: {
          TR: formuleTR,
          IC: formuleIC,
          CC: formuleCC
        }
      });

      TR_prev = TR;
      CC_prev = CC;
    });

    return results;
  };

  return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #e0f2f1, #bbdefb)', padding: 3 }}>
        <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 36, color: '#4caf50', marginRight: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
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
                {/* Section Janvier - Paramètres initiaux */}
                <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <AttachMoney sx={{ fontSize: 30, color: '#2196f3', marginRight: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Paramètres de Janvier
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 4}}>
                      <TextField
                          label="Épargne Réunion (ER) - FRCFA"
                          type="number"
                          fullWidth
                          value={epargneReunion}
                          onChange={(e) => setEpargneReunion(e.target.value)}
                          placeholder="Ex: 5000"
                          variant="outlined"
                          required
                      />
                    </Grid>
                    <Grid size={{xs: 12, md: 4}}>
                      <TextField
                          label="Intérêt Réunion (IR) - FRCFA"
                          type="number"
                          fullWidth
                          value={interetReunion}
                          onChange={(e) => setInteretReunion(e.target.value)}
                          placeholder="Ex: 150"
                          variant="outlined"
                          required
                      />
                    </Grid>
                    <Grid size={{xs: 12, md: 4}}>
                      <Button
                          variant={'contained'}
                          fullWidth
                          sx={{ height: '56px', backgroundColor: '#4caf50' }}
                      >
                        Enregistrer
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Section mensuelle (Janvier à Octobre) */}
                <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3 }}>
                    Épargne Client Mensuelle (EC)
                  </Typography>
                  <Grid container spacing={3}>
                    {mois.map((month, idx) => (
                        <Grid size={{xs: 12, sm: 6, md: 3}} key={month}>
                          <TextField
                              label={`${moisLabels[idx]} - EC`}
                              type="number"
                              fullWidth
                              value={monthlyData[month]}
                              onChange={(e) => handleMonthlyChange(month, e.target.value)}
                              placeholder="FRCFA"
                              variant="outlined"
                          />
                        </Grid>
                    ))}
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
              <Paper sx={{ padding: 3, boxShadow: 3 }}>
                {/* Résumé global */}
                <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                  <Grid size={{xs: 12, sm: 4}}>
                    <Paper sx={{ padding: 2, backgroundColor: '#e3f2fd', boxShadow: 2 }}>
                      <Typography variant="body1" sx={{ color: '#555' }}>Épargne Réunion (ER)</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {parseInt(epargneReunion).toFixed(0)} FRCFA
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{xs: 12, sm: 4}}>
                    <Paper sx={{ padding: 2, backgroundColor: '#c8e6c9', boxShadow: 2 }}>
                      <Typography variant="body1" sx={{ color: '#555' }}>Intérêt Réunion (IR)</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                        {parseInt(interetReunion).toFixed(0)} FRCFA
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{xs: 12, sm: 4}}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f3e5f5', boxShadow: 2 }}>
                      <Typography variant="body1" sx={{ color: '#555' }}>Total Épargne Client</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                        {Object.values(monthlyData).reduce((sum, val) => sum + (parseInt(val) || 0), 0).toFixed(0)} FRCFA
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
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">ÉPARGNE RÉUNION (ER)</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">INTÉRÊT RÉUNION (IR)</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">TOTAL RÉUNION (TR)</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">ÉPARGNE CLIENT (EC)</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">INTÉRÊT CLIENT (IC)</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="right">CAPITAL CLIENT (CC)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculateResults().map((row, index) => (
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
                      <br />• Janvier: TR = ER
                      <br />• Autres mois: TR = TR(mois précédent) + IR(mois précédent) + ER(mois actuel)
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                      <strong style={{ color: '#e65100' }}>Intérêt Client (IC):</strong>
                      <br />• Janvier: IC = (EC × IR) ÷ TR
                      <br />• Autres mois: IC = (CC du mois précédent × IR) ÷ TR
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
