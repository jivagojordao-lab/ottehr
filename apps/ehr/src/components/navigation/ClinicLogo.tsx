import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CLINIC_BRANDING } from '../../constants/clinicBranding';

interface ClinicLogoProps {
  height?: number | string;
  showText?: boolean;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({ height = 40, showText = true }) => {
  const [imageError, setImageError] = useState(false);

  // Se houver uma URL de imagem configurada e ela não falhou ao carregar:
  if (CLINIC_BRANDING.logoUrl && !imageError) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height }}>
        <img
          src={CLINIC_BRANDING.logoUrl}
          alt={`${CLINIC_BRANDING.name} logo`}
          style={{ height: '100%', maxHeight: height, width: 'auto', objectFit: 'contain' }}
          onError={() => setImageError(true)}
        />
      </Box>
    );
  }

  // Logotipo Vetorial Moderno Padrão (Brasão de Saúde + Tipografia)
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        cursor: 'pointer',
        userSelect: 'none',
        height,
      }}
    >
      {/* Emblema / Ícone da Clínica */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          bgcolor: CLINIC_BRANDING.primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(24, 119, 242, 0.35)',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cruz Médica com Cantos Arredondados */}
          <rect x="9.5" y="3" width="5" height="18" rx="2.5" fill="#FFFFFF" />
          <rect x="3" y="9.5" width="18" height="5" rx="2.5" fill="#FFFFFF" />
        </svg>
      </Box>

      {/* Tipografia da Marca */}
      {showText && (
        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: '19px',
              letterSpacing: '-0.4px',
              color: CLINIC_BRANDING.primaryColor,
              lineHeight: 1.1,
              fontFamily: '"Rubik", "Segoe UI", Roboto, sans-serif',
            }}
          >
            {CLINIC_BRANDING.shortName}
          </Typography>
          <Typography
            variant="caption"
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: '9.5px',
              letterSpacing: '1.8px',
              textTransform: 'uppercase',
              color: '#65676B',
              lineHeight: 1,
              mt: 0.3,
            }}
          >
            {CLINIC_BRANDING.subtitle}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
