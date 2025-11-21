"use client"

import React, { useState } from 'react';
import { CalendarToday, TrendingUp, Description, ExpandMore } from '@mui/icons-material';
import { TextField, Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function Home() {
  const [currentYear] = useState(new Date().getFullYear());
  
  // Données mensuelles avec EC, ER et IR pour chaque mois
  const [monthlyData, setMonthlyData] = useState({
    janvier: { ec: '', er: '5000', ir: '150' },
    fevrier: { ec: '', er: '5000', ir: '150' },
    mars: { ec: '', er: '5000', ir: '150' },
    avril: { ec: '', er: '5000', ir: '150' },
    mai: { ec: '', er: '5000', ir: '150' },
    juin: { ec: '', er: '5000', ir: '150' },
    juillet: { ec: '', er: '5000', ir: '150' },
    aout: { ec: '', er: '5000', ir: '150' },
    septembre: { ec: '', er: '5000', ir: '150' },
    octobre: { ec: '', er: '5000', ir: '150' }
  });
  
  // État pour gérer l'ouverture/fermeture des collapses
  const [expandedMonths, setExpandedMonths] = useState({});
  
  const [showRecap, setShowRecap] = useState(false);

  const mois = [
    'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'aout', 'septembre', 'octobre'
  ];

  const moisLabels = [
    'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE'
  ];

  const handleMonthlyChange = (month, field, value) => {
    setMonthlyData(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: value
      }
    }));
  };

  const toggleExpand = (month) => {
    setExpandedMonths(prev => ({
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
    const results = [];
    
    let TR_prev = 0;
    let CC_prev = 0;

    mois.forEach((month, index) => {
      const EC = Math.floor(parseFloat(monthlyData[month].ec) || 0);
      const ER = Math.floor(parseFloat(monthlyData[month].er) || 0);
      const IR = Math.floor(parseFloat(monthlyData[month].ir) || 0);
      
      let TR, IC, CC;
      let formuleTR, formuleIC, formuleCC;

      if (index === 0) {
        // JANVIER
        TR = ER;
        IC = (EC * IR) / TR;
        CC = EC + IC + (Math.floor(parseFloat(monthlyData[mois[1]].ec) || 0));

        formuleTR = `ER${moisLabels[0]} = ${ER.toFixed(0)}`;
        formuleIC = `(EC${moisLabels[0]} × IR${moisLabels[0]}) ÷ TR${moisLabels[0]} = (${EC.toFixed(0)} × ${IR.toFixed(0)}) ÷ ${TR.toFixed(0)}`;
        formuleCC = `EC${moisLabels[0]} + IC${moisLabels[0]} + EC${moisLabels[1]} = ${EC.toFixed(0)} + ${IC.toFixed(0)} + ${(Math.floor(parseFloat(monthlyData[mois[1]].ec) || 0)).toFixed(0)}`;
      } else {
        // FEVRIER à OCTOBRE
        const IR_prev = Math.floor(parseFloat(monthlyData[mois[index-1]].ir) || 0);
        const ER_prev = Math.floor(parseFloat(monthlyData[mois[index-1]].er) || 0);
        
        TR = TR_prev + IR_prev + ER;
        IC = (CC_prev * IR) / TR;
        const nextEC = index < 9 ? Math.floor(parseFloat(monthlyData[mois[index + 1]].ec) || 0) : 0;
        CC = CC_prev + IC + nextEC;

        formuleTR = `TR${moisLabels[index-1]} + IR${moisLabels[index-1]} + ER${moisLabels[index]} = ${TR_prev.toFixed(0)} + ${IR_prev.toFixed(0)} + ${ER.toFixed(0)}`;
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
            {/* Section mensuelle avec paramètres ER et IR en collapse */}
            <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 2 }}>
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
            <Paper sx={{ padding: 3, marginBottom: 4, backgroundColor: '#fff9c4', boxShadow: 2 }}>
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
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                📊 Récapitulatif Annuel {currentYear}
              </Typography>
              <Button onClick={() => setShowRecap(false)} variant="outlined" color="secondary">
                Modifier
              </Button>
            </Box>

            {/* Résumé global */}
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Paper sx={{ padding: 2, backgroundColor: '#f3e5f5', boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Total Épargne Client</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    {mois.reduce((sum, m) => sum + (parseInt(monthlyData[m].ec) || 0), 0).toFixed(0)} FRCFA
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Paper sx={{ padding: 2, backgroundColor: '#e3f2fd', boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Capital Final (CC)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                    {calculateResults()[9]?.CC || '0'} FRCFA
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Paper sx={{ padding: 2, backgroundColor: '#c8e6c9', boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555' }}>Intérêts Totaux (IC)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                    {calculateResults().reduce((sum, row) => sum + parseFloat(row.IC), 0).toFixed(0)} FRCFA
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
