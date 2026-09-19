import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { Patient } from 'fhir/r4b';
import { FC, ReactElement, useState } from 'react';
import { dataTestIds } from 'src/constants/data-test-ids';
import { getPatientFriendlyId } from 'utils/lib/fhir/patient';

type Props = {
  patient?: Patient;
  loading?: boolean;
  showPidPrefix?: boolean;
};

export const IdentifiersRow: FC<Props> = ({ patient, loading, showPidPrefix = true }) => {
  const friendlyId = patient ? getPatientFriendlyId(patient) : '';
  const cpfIdentifier = patient?.identifier?.find(
    (ident) =>
      ident.system === 'https://saude.gov.br/fhir/sid/cpf' ||
      ident.system === 'https://rnds.saude.gov.br/fhir/r4/NamingSystem/cpf'
  )?.value;

  const formattedCpf = cpfIdentifier
    ? cpfIdentifier.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {loading ? (
          <Skeleton width={300} />
        ) : friendlyId ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" data-testid={dataTestIds.patientHeader.patientId} sx={{ userSelect: 'none' }}>
              {showPidPrefix ? `PID: ${friendlyId}` : friendlyId}
            </Typography>
            <Tooltip
              title={
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
                      <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        PID:
                      </Box>{' '}
                      {friendlyId}
                    </Typography>
                    <CopyButton value={friendlyId} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'inherit', whiteSpace: 'nowrap' }}>
                      <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        UUID:
                      </Box>{' '}
                      {patient?.id ?? ''}
                    </Typography>
                    <CopyButton value={patient?.id ?? ''} />
                  </Box>
                </Box>
              }
              placement="bottom"
              disableInteractive={false}
              leaveDelay={200}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 2,
                    maxWidth: 'none',
                  },
                },
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'pointer' }} />
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" data-testid={dataTestIds.patientHeader.patientId} sx={{ userSelect: 'none' }}>
              {showPidPrefix ? `PID: ${patient?.id ?? ''}` : patient?.id ?? ''}
            </Typography>
            <CopyButton value={patient?.id ?? ''} />
          </Box>
        )}
      </Box>

      {formattedCpf && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 600, bgcolor: 'primary.50', px: 0.75, py: 0.25, borderRadius: 1 }}>
            CPF: {formattedCpf}
          </Typography>
          <CopyButton value={cpfIdentifier || ''} />
        </Box>
      )}
    </Box>
  );
};

const CopyButton = ({ value }: { value: string }): ReactElement => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
      {copied ? (
        <CheckIcon sx={{ fontSize: 14, color: 'success.main' }} />
      ) : (
        <ContentCopyIcon sx={{ fontSize: 14, color: 'primary.main' }} />
      )}
    </IconButton>
  );
};
