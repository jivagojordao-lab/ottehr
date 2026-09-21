import { LoadingButton } from '@mui/lab';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIErrorCode } from 'utils/lib/types/errors';
import { createUser } from '../api/api';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import { useApiClients } from '../hooks/useAppClients';
import PageContainer from '../layout/PageContainer';

export default function AddEmployeePage(): ReactElement {
  const { oystehrZambda } = useApiClients();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const applicationID = import.meta.env.VITE_APP_OYSTEHR_APPLICATION_ID;

  async function createEmployee(event: any): Promise<void> {
    event.preventDefault();
    if (!oystehrZambda || !email || !firstName || !lastName) {
      throw new Error('oystehrZambda, email, firstName, or lastName is not set');
    }
    setLoading(true);
    try {
      const createUserResponse = await createUser(oystehrZambda, {
        email,
        firstName,
        lastName,
        applicationID,
      });
      navigate(`/admin/employee/${createUserResponse.userID}`);
    } catch (error: any) {
      let parsedError = error;

      if (typeof error.message === 'string') {
        try {
          parsedError = JSON.parse(error.message);
        } catch {
          // ignore parse error, keep original
        }
      }

      if (parsedError?.code === APIErrorCode.USER_ALREADY_EXISTS) {
        enqueueSnackbar('Usuário já é membro do projeto', { variant: 'error' });
        return;
      }

      enqueueSnackbar('Erro inesperado ao criar usuário', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <>
        <Box marginX={12}>
          {/* Breadcrumbs */}
          <CustomBreadcrumbs
            chain={[
              { link: '/admin', children: 'Administração' },
              { link: '/admin/employees', children: 'Colaboradores' },
              { link: '#', children: 'Adicionar colaborador' },
            ]}
          />
          <Paper sx={{ padding: 2 }}>
            {/* Page title */}
            <Typography variant="h3" color="primary.dark" marginBottom={1}>
              Adicionar colaborador
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Isso atribuirá imediatamente a função de Recepção / Equipe ao usuário.
            </Typography>
            <form onSubmit={createEmployee}>
              <TextField
                label="E-mail"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                sx={{
                  marginBottom: 3,
                  width: 300,
                }}
              />
              <br />
              <TextField
                label="Nome"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                sx={{
                  marginBottom: 3,
                  width: 300,
                }}
              />
              <br />
              <TextField
                label="Sobrenome"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                sx={{
                  marginBottom: 3,
                  width: 300,
                }}
              />
              <br />
              <LoadingButton type="submit" loading={loading} variant="contained" sx={{ marginTop: 2 }}>
                Salvar
              </LoadingButton>
            </form>
          </Paper>
        </Box>
      </>
    </PageContainer>
  );
}
