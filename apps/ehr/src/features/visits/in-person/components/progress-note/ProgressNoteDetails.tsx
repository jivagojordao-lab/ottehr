import { otherColors } from '@ehrTheme/colors';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApptTab } from 'src/components/AppointmentTabs';
import { RoundedButton } from 'src/components/RoundedButton';
import { dataTestIds } from 'src/constants/data-test-ids';
import { FEATURE_FLAGS } from 'src/constants/feature-flags';
import { ImmunizationContainer } from 'src/features/visits/in-person/components/ImmunizationContainer';
import { LabResultsReviewContainer } from 'src/features/visits/in-person/components/LabResultsReviewContainer';
import { AssessmentBody } from 'src/features/visits/shared/components/assessment-tab/AssessmentBody';
import { ExamBody } from 'src/features/visits/shared/components/exam-tab/ExamBody';
import { ExamMigrationWarning } from 'src/features/visits/shared/components/exam-tab/ExamMigrationWarning';
import { useExamConfigState } from 'src/features/visits/shared/components/exam-tab/useExamConfigState';
import { AdditionalQuestionsContainer } from 'src/features/visits/shared/components/review-tab/components/AdditionalQuestionsContainer';
import { AllergiesContainer } from 'src/features/visits/shared/components/review-tab/components/AllergiesContainer';
import { AssessmentGroupContainer } from 'src/features/visits/shared/components/review-tab/components/AssessmentGroupContainer';
import { ChiefComplaintContainer } from 'src/features/visits/shared/components/review-tab/components/ChiefComplaintContainer';
import { ExaminationContainer } from 'src/features/visits/shared/components/review-tab/components/ExaminationContainer';
import { HpiMoiContainer } from 'src/features/visits/shared/components/review-tab/components/HpiMoiContainer';
import { MedicalConditionsContainer } from 'src/features/visits/shared/components/review-tab/components/MedicalConditionsContainer';
import { MedicationsContainer } from 'src/features/visits/shared/components/review-tab/components/MedicationsContainer';
import { PatientInstructionsContainer } from 'src/features/visits/shared/components/review-tab/components/PatientInstructionsContainer';
import { PrescribedMedicationsContainer } from 'src/features/visits/shared/components/review-tab/components/PrescribedMedicationsContainer';
import { PrivacyPolicyAcknowledgement } from 'src/features/visits/shared/components/review-tab/components/PrivacyPolicyAcknowledgement';
import { ProceduresContainer } from 'src/features/visits/shared/components/review-tab/components/ProceduresContainer';
import { RadiologyOrdersContainer } from 'src/features/visits/shared/components/review-tab/components/RadiologyOrdersContainer';
import { ReviewOfSystemsContainer } from 'src/features/visits/shared/components/review-tab/components/ReviewOfSystemsContainer';
import { SurgicalHistoryContainer } from 'src/features/visits/shared/components/review-tab/components/SurgicalHistoryContainer';
import { RosBody } from 'src/features/visits/shared/components/ros-tab/RosBody';
import { RosReviewContainer } from 'src/features/visits/shared/components/ros-tab/RosReviewContainer';
import { useChartFields } from 'src/features/visits/shared/hooks/useChartFields';
import { useGetAppointmentAccessibility } from 'src/features/visits/shared/hooks/useGetAppointmentAccessibility';
import { useOystehrAPIClient } from 'src/features/visits/shared/hooks/useOystehrAPIClient';
import { usePatientInstructionsVisibility } from 'src/features/visits/shared/hooks/usePatientInstructionsVisibility';
import { useAppointmentData, useChartData } from 'src/features/visits/shared/stores/appointment/appointment.store';
import { useRosObservationsStore } from 'src/features/visits/shared/stores/appointment/ros-observations.store';
import { useSignAppointmentMutation } from 'src/features/visits/shared/stores/tracking-board/tracking-board.queries';
import { isEligibleSupervisor } from 'src/helpers';
import useEvolveUser from 'src/hooks/useEvolveUser';
import { INCOMPATIBLE_EXAM_VERSION_MESSAGE } from 'utils/lib/fhir/constants';
import { progressNoteChartDataRequestedFields } from 'utils/lib/helpers/visit-note/progress-note-chart-data-requested-fields.helper';
import { examConfig } from 'utils/lib/ottehr-config/examination';
import { NOTE_TYPE } from 'utils/lib/types/api/chart-data/chart-data.types';
import { LabType } from 'utils/lib/types/data/labs/labs.types';
import { getSupervisorApprovalStatus } from 'utils/lib/utils/visitUtils';
import { useGetImmunizationOrders } from '../../hooks/useImmunization';
import { useMedicationAPI } from '../../hooks/useMedicationOperations';
import { AllergiesBody } from '../allergies/AllergiesBody';
import { ChiefComplaintBody } from '../chief-complaint/ChiefComplaintBody';
import { HospitalizationBody } from '../hospitalization/HospitalizationBody';
import { HistoryAndTemplatesBody } from '../hpi/HistoryAndTemplatesBody';
import { MedicalConditionsBody } from '../medical-conditions/MedicalConditionsBody';
import { MedicationsBody } from '../medications/MedicationsBody';
import { PlanBody } from '../plan/PlanBody';
import { ScreeningBody } from '../screening/ScreeningBody';
import { SurgicalHistoryBody } from '../surgical-history/SurgicalHistoryBody';
import { PatientVitalsBody } from '../vitals/PatientVitalsBody';
import { BlankSection } from './BlankSection';
import { ERXInlineFlow } from './ERXInlineFlow';
import { ExternalLabsInlineFlow } from './ExternalLabsInlineFlow';
import { HospitalizationContainer } from './HospitalizationContainer';
import { ImmunizationInlineFlow } from './ImmunizationInlineFlow';
import { InHouseLabsInlineFlow } from './InHouseLabsInlineFlow';
import { InHouseMedicationsContainer } from './InHouseMedicationsContainer';
import { InHouseMedicationsInlineFlow } from './InHouseMedicationsInlineFlow';
import { InlineEditSection } from './InlineEditSection';
import { NoteSectionCard } from './NoteSectionCard';
import { NursingOrdersInlineFlow } from './NursingOrdersInlineFlow';
import { NursingOrdersReviewContainer } from './NursingOrdersReviewContainer';
import { PatientVitalsContainer } from './PatientVitalsContainer';
import { ProceduresInlineFlow } from './ProceduresInlineFlow';
import { RadiologyInlineFlow } from './RadiologyInlineFlow';

export const ProgressNoteDetails: FC = () => {
  const { appointment, encounter } = useAppointmentData();
  const apiClient = useOystehrAPIClient();
  // Appointment-scoped: must match how save-chart-data picks the config, otherwise
  // telemed appointments opened under /in-person/:id/* mismatch the backend.
  const examConfigComponents = examConfig.default.components;
  const { unmatchedExamFields, displayExamMigrationWarning, hasIncompatibleExamConfig } =
    useExamConfigState(examConfigComponents);
  const { mutateAsync: signAppointment, isPending: isSignLoading } = useSignAppointmentMutation();
  const rosState = useRosObservationsStore();

  const isLoading = isSignLoading;
  const user = useEvolveUser();
  const navigate = useNavigate();

  const { data: chartFields } = useChartFields({ requestedFields: progressNoteChartDataRequestedFields });
  const { chartData } = useChartData();
  const { medications: inHouseMedications } = useMedicationAPI();

  const { data: immunizationOrdersResponse } = useGetImmunizationOrders({
    encounterIds: [encounter.id!],
  });

  const immunizationOrders = (immunizationOrdersResponse?.orders ?? []).filter((order) =>
    ['administered', 'administered-partly'].includes(order.status)
  );

  const screeningNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.SCREENING);
  const vitalsNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.VITALS);
  const allergyNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.ALLERGY);
  const intakeMedicationNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.INTAKE_MEDICATION);
  const hospitalizationNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.HOSPITALIZATION);
  const medicalConditionNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.MEDICAL_CONDITION);
  const surgicalHistoryNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.SURGICAL_HISTORY);
  const inHouseMedicationNotes = chartFields?.notes?.filter((note) => note.type === NOTE_TYPE.MEDICATION);
  const medicalDecision = chartFields?.medicalDecision?.text;
  const prescriptions = chartFields?.prescribedMedications;
  const vitalsObservations = chartFields?.vitalsObservations;
  const externalLabResults = chartFields?.externalLabResults;
  const inHouseLabResults = chartFields?.inHouseLabResults;
  const radiologyOrders = chartFields?.radiologyOrders;
  const chiefComplaint = chartFields?.historyOfPresentIllness?.text;
  const reasonForVisit = chartFields?.reasonForVisit?.text;
  const mechanismOfInjury = chartFields?.mechanismOfInjury?.text;
  const hpi = chartFields?.chiefComplaint?.text;
  const rosLegacyText = chartFields?.ros?.text;

  const emCode = chartData?.emCode;
  const cptCodes = chartData?.cptCodes;
  const diagnoses = chartData?.diagnosis;
  const observations = chartData?.observations;

  const showChiefComplaint = !!(chiefComplaint && chiefComplaint.length > 0);
  const showReasonForVisit = !!(reasonForVisit && reasonForVisit.length > 0);
  const showMechanismOfInjury = !!(mechanismOfInjury && mechanismOfInjury.length > 0);
  const showHpi = !!(hpi && hpi.length > 0);
  const showLegacyReviewOfSystems = !!(rosLegacyText && rosLegacyText.length > 0);
  const showAdditionalQuestions =
    !!(observations && observations.length > 0) || !!(screeningNotes && screeningNotes.length > 0);
  const showAssessment = !!(diagnoses && diagnoses.length > 0);
  const showMedicalDecisionMaking = !!(medicalDecision && medicalDecision.length > 0);
  const showEmCode = !!emCode;
  const showCptCodes = !!(cptCodes && cptCodes.length > 0);
  const showRosReviewContainer = Object.values(rosState).filter((rosObs) => rosObs.value).length > 0;

  const externalLabResultsPending = !!(
    externalLabResults?.resultsPending && externalLabResults?.resultsPending.length > 0
  );
  const externalLabResultsReceived = !!(
    externalLabResults?.labOrderResults && externalLabResults?.labOrderResults.length > 0
  );
  const showExternalLabsResultsContainer = externalLabResultsPending || externalLabResultsReceived;

  const inHouseLabResultsPending = !!(
    inHouseLabResults?.resultsPending && inHouseLabResults?.resultsPending.length > 0
  );
  const inHouseLabResultsEntered = !!(
    inHouseLabResults?.labOrderResults && inHouseLabResults?.labOrderResults.length > 0
  );
  const showInHouseLabsResultsContainer = !!(inHouseLabResultsPending || inHouseLabResultsEntered);

  const showRadiologyContainer = !!(radiologyOrders && radiologyOrders?.length > 0);

  const showProceduresContainer = (chartData?.procedures?.length ?? 0) > 0;
  const showPrescribedMedications = !!(prescriptions && prescriptions.length > 0);
  const { showPatientInstructions } = usePatientInstructionsVisibility();
  const showInHouseMedications =
    !!(inHouseMedications && inHouseMedications.length > 0) ||
    !!(inHouseMedicationNotes && inHouseMedicationNotes.length > 0);
  const showImmunization = immunizationOrders.length > 0;

  const showVitalsObservations =
    !!(vitalsObservations && vitalsObservations.length > 0) || !!(vitalsNotes && vitalsNotes.length > 0);

  const approvalStatus = FEATURE_FLAGS.SUPERVISOR_APPROVAL_ENABLED
    ? getSupervisorApprovalStatus(appointment, encounter)
    : 'unknown';

  const { isAppointmentReadOnly } = useGetAppointmentAccessibility();
  const inlineEditEnabled = !isAppointmentReadOnly;
  // The supervisor approval box reuses these sections as a read-only summary.
  const inlineEditDisabled = approvalStatus === 'waiting-for-approval';

  const medicalHistorySections = [
    <InlineEditSection
      key="allergies"
      sectionName="allergies"
      title="Alergias"
      iconKey="Allergies"
      editLabel="Editar alergias"
      editContent={<AllergiesBody />}
      disabled={inlineEditDisabled}
    >
      <AllergiesContainer notes={allergyNotes} />
    </InlineEditSection>,
    <InlineEditSection
      key="medications"
      sectionName="medications"
      title="Medicamentos em Uso"
      iconKey="Medications"
      editLabel="Editar medicamentos"
      editContent={<MedicationsBody />}
      disabled={inlineEditDisabled}
    >
      <MedicationsContainer notes={intakeMedicationNotes} />
    </InlineEditSection>,
    <InlineEditSection
      key="medical-conditions"
      sectionName="medical-conditions"
      title="Comorbidades"
      iconKey="Medical Conditions"
      editLabel="Editar comorbidades"
      editContent={<MedicalConditionsBody />}
      disabled={inlineEditDisabled}
    >
      <MedicalConditionsContainer notes={medicalConditionNotes} />
    </InlineEditSection>,
    <InlineEditSection
      key="surgical-history"
      sectionName="surgical-history"
      title="Histórico Cirúrgico"
      iconKey="Surgical History"
      editLabel="Editar histórico cirúrgico"
      editContent={<SurgicalHistoryBody />}
      disabled={inlineEditDisabled}
    >
      <SurgicalHistoryContainer notes={surgicalHistoryNotes} />
    </InlineEditSection>,
    <InlineEditSection
      key="hospitalization"
      sectionName="hospitalization"
      title="Internações Prévias"
      iconKey="Hospitalization"
      editLabel="Editar internações prévias"
      editContent={<HospitalizationBody />}
      disabled={inlineEditDisabled}
    >
      <HospitalizationContainer notes={hospitalizationNotes} />
    </InlineEditSection>,
    (showInHouseMedications || inlineEditEnabled) && (
      <InlineEditSection
        key="in-house-medications"
        sectionName="in-house-medications"
        title="Medicamentos na Clínica"
        iconKey="Med. Administration"
        editLabel="Editar medicamentos na clínica"
        editContent={<InHouseMedicationsInlineFlow />}
        disabled={inlineEditDisabled}
      >
        {showInHouseMedications ? (
          <InHouseMedicationsContainer medications={inHouseMedications} notes={inHouseMedicationNotes} />
        ) : (
          <BlankSection message="Nenhum medicamento administrado na clínica" />
        )}
      </InlineEditSection>
    ),
    (showImmunization || inlineEditEnabled) && (
      <InlineEditSection
        key="immunizations"
        sectionName="immunizations"
        title="Vacinas / Imunização"
        iconKey="Immunization"
        editLabel="Editar vacinas"
        editContent={<ImmunizationInlineFlow />}
        disabled={inlineEditDisabled}
      >
        {showImmunization ? (
          <ImmunizationContainer orders={immunizationOrders} />
        ) : (
          <BlankSection message="Nenhuma imunização registrada" />
        )}
      </InlineEditSection>
    ),
  ].filter(Boolean);

  const sections = [
    displayExamMigrationWarning && !hasIncompatibleExamConfig && (
      <ExamMigrationWarning key="exam-migration-warning" unmatchedFields={unmatchedExamFields} />
    ),
    (showChiefComplaint || showReasonForVisit || inlineEditEnabled) && (
      <InlineEditSection
        key="chief-complaint"
        sectionName="chief-complaint"
        title="Queixa Principal"
        iconKey="Chief Complaint"
        editLabel="Editar queixa principal"
        editContent={<ChiefComplaintBody />}
      >
        <ChiefComplaintContainer />
      </InlineEditSection>
    ),
    // HPI and MOI are documented on the same screen and read as one section with a
    // subsection each; MOI only appears for the injury visits that have it.
    (showHpi || showMechanismOfInjury || inlineEditEnabled) && (
      <InlineEditSection
        key="hpi-moi"
        sectionName="hpi-moi"
        title="Anamnese (HMA)"
        iconKey="History"
        editLabel="Editar anamnese"
        editContent={<HistoryAndTemplatesBody />}
      >
        <HpiMoiContainer />
      </InlineEditSection>
    ),
    showLegacyReviewOfSystems && (
      <NoteSectionCard key="legacy-review-of-systems" title="Interrogatório Sintomatológico" iconKey="Checklist">
        <ReviewOfSystemsContainer />
      </NoteSectionCard>
    ),
    (showRosReviewContainer || inlineEditEnabled) && (
      <InlineEditSection
        key="review-of-systems"
        sectionName="review-of-systems"
        title="Interrogatório Sintomatológico"
        iconKey="Checklist"
        editLabel="Editar interrogatório"
        editContent={<RosBody />}
      >
        <RosReviewContainer />
      </InlineEditSection>
    ),
    (showAdditionalQuestions || inlineEditEnabled) && (
      <InlineEditSection
        key="screening"
        sectionName="screening"
        title="Perguntas de Triagem"
        iconKey="Screening Questions"
        editLabel="Editar triagem"
        editContent={<ScreeningBody />}
      >
        <AdditionalQuestionsContainer notes={screeningNotes} emptyMessage="Nenhuma resposta registrada" />
      </InlineEditSection>
    ),
    (showVitalsObservations || inlineEditEnabled) && (
      <InlineEditSection
        key="vitals"
        sectionName="vitals"
        title="Sinais Vitais"
        iconKey="Vitals"
        editLabel="Editar sinais vitais"
        editContent={<PatientVitalsBody />}
      >
        <PatientVitalsContainer notes={vitalsNotes} encounterId={encounter?.id} />
      </InlineEditSection>
    ),

    <InlineEditSection
      key="examination"
      sectionName="examination"
      title="Exame Físico"
      iconKey="Stethoscope"
      editLabel="Editar exame físico"
      editContent={<ExamBody />}
      disabled={displayExamMigrationWarning && hasIncompatibleExamConfig}
    >
      {/* If the exam version is flagged as incompatible, we cannot run the migration safely.
       If it both needs migration and is incompatible, hide the exam and direct the user to the visit PDF. */}
      {displayExamMigrationWarning && hasIncompatibleExamConfig ? (
        <Typography color="text.secondary">{INCOMPATIBLE_EXAM_VERSION_MESSAGE}</Typography>
      ) : (
        <ExaminationContainer examConfig={examConfigComponents} />
      )}
    </InlineEditSection>,
    ...(!(approvalStatus === 'waiting-for-approval') ? medicalHistorySections : []),
    (showInHouseLabsResultsContainer || (inlineEditEnabled && FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED)) && (
      <InlineEditSection
        key="in-house-labs"
        sectionName="in-house-labs"
        title="Exames Rápidos (Point-of-Care)"
        iconKey="In-House Labs"
        editLabel="Editar exames rápidos"
        editContent={<InHouseLabsInlineFlow />}
      >
        {showInHouseLabsResultsContainer ? (
          <LabResultsReviewContainer
            resultDetails={{ type: LabType.inHouse, results: inHouseLabResults.labOrderResults }}
            resultsPending={inHouseLabResultsPending}
          />
        ) : (
          <BlankSection message="Nenhum exame rápido solicitado" />
        )}
      </InlineEditSection>
    ),
    (showExternalLabsResultsContainer || (inlineEditEnabled && FEATURE_FLAGS.LAB_ORDERS_ENABLED)) && (
      <InlineEditSection
        key="external-labs"
        sectionName="external-labs"
        title="Exames Laboratoriais"
        iconKey="External Labs"
        editLabel="Editar exames laboratoriais"
        editContent={<ExternalLabsInlineFlow />}
      >
        {showExternalLabsResultsContainer ? (
          <LabResultsReviewContainer
            resultDetails={{ type: LabType.external, results: externalLabResults.labOrderResults }}
            resultsPending={externalLabResultsPending}
          />
        ) : (
          <BlankSection message="Nenhum exame laboratorial solicitado" />
        )}
      </InlineEditSection>
    ),
    (showRadiologyContainer || (inlineEditEnabled && FEATURE_FLAGS.RADIOLOGY_ENABLED)) && (
      <InlineEditSection
        key="radiology"
        sectionName="radiology"
        title="Radiologia & Imagem"
        iconKey="Radiology"
        editLabel="Editar exames de imagem"
        editContent={<RadiologyInlineFlow />}
      >
        <RadiologyOrdersContainer radiologyOrders={radiologyOrders ?? []} />
      </InlineEditSection>
    ),
    (showProceduresContainer || inlineEditEnabled) && (
      <InlineEditSection
        key="procedures"
        sectionName="procedures"
        title="Procedimentos"
        iconKey="Procedures"
        editLabel="Editar procedimentos"
        editContent={<ProceduresInlineFlow />}
      >
        {showProceduresContainer ? <ProceduresContainer /> : <BlankSection message="Nenhum procedimento registrado" />}
      </InlineEditSection>
    ),
    // Staff-facing only: nursing orders are shown here for the signing provider but are
    // deliberately left out of the visit note and discharge PDFs.
    <InlineEditSection
      key="nursing-orders"
      sectionName="nursing-orders"
      title="Ordens de Enfermagem"
      iconKey="Nursing Orders"
      editLabel="Editar ordens de enfermagem"
      editContent={<NursingOrdersInlineFlow />}
    >
      <NursingOrdersReviewContainer encounterId={encounter?.id} />
    </InlineEditSection>,
    (showPrescribedMedications || inlineEditEnabled) && (
      <InlineEditSection
        key="prescriptions"
        sectionName="prescriptions"
        title="Prescrições"
        iconKey="eRX"
        editLabel="Editar prescrições"
        editContent={<ERXInlineFlow />}
      >
        {showPrescribedMedications ? <PrescribedMedicationsContainer /> : <BlankSection message="Nenhuma prescrição registrada" />}
      </InlineEditSection>
    ),
    // Diagnoses, medical decision making and the billing codes are all documented on the
    // Assessment screen, so they read as subsections of one Assessment section.
    (showAssessment || showMedicalDecisionMaking || showEmCode || showCptCodes || inlineEditEnabled) && (
      <InlineEditSection
        key="assessment"
        sectionName="assessment"
        title="Hipóteses Diagnósticas (CID-10)"
        iconKey="Prescription"
        editLabel="Editar diagnósticos"
        editContent={<AssessmentBody />}
      >
        <AssessmentGroupContainer />
      </InlineEditSection>
    ),
    (showPatientInstructions || inlineEditEnabled) && (
      <InlineEditSection
        key="plan"
        sectionName="plan"
        title="Conduta & Plano Terapêutico"
        iconKey="Lab profile"
        editLabel="Editar conduta"
        editContent={<PlanBody />}
      >
        {showPatientInstructions ? (
          <PatientInstructionsContainer />
        ) : (
          <BlankSection message="Nenhuma orientação registrada" />
        )}
      </InlineEditSection>
    ),
    <PrivacyPolicyAcknowledgement key="privacy-policy-acknowledgement" />,
  ].filter(Boolean);

  const handleApprove = async (): Promise<void> => {
    if (!apiClient || !appointment?.id) {
      throw new Error('api client not defined or appointmentId not provided');
    }
    await signAppointment({
      apiClient,
      appointmentId: appointment.id,
      timezone: DateTime.now().zoneName,
      supervisorApprovalEnabled: FEATURE_FLAGS.SUPERVISOR_APPROVAL_ENABLED,
      encounterId: encounter.id!,
    });
    navigate(`/visits?tab=${ApptTab.completed}`);
  };

  return (
    <Stack spacing={2} data-testid={dataTestIds.progressNotePage.visitNoteCard}>
      <Typography variant="h5" color="primary.dark">
        Evolução do Atendimento (Visit Note)
      </Typography>
      {FEATURE_FLAGS.SUPERVISOR_APPROVAL_ENABLED &&
        approvalStatus === 'waiting-for-approval' &&
        user &&
        isEligibleSupervisor(user.profileResource!) && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                border: 1,
                borderColor: otherColors.warningBorder,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: 'fit-content',
                  marginTop: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 0.5,
                  gap: 1.5,
                  alignItems: 'center',
                  bgcolor: otherColors.lightErrorBg,
                }}
              >
                <ErrorOutlineIcon sx={{ color: otherColors.warningIcon }} />
                <Typography color={otherColors.warningText} fontWeight={600}>
                  Histórico médico deve ser confirmado pelo profissional assistente
                </Typography>
                <RoundedButton variant="contained" size="small" onClick={handleApprove} loading={isLoading}>
                  Aprovar
                </RoundedButton>
              </Box>

              <Stack spacing={2}>{medicalHistorySections}</Stack>
            </Box>
          </>
        )}
      <Stack spacing={2}>{sections}</Stack>
    </Stack>
  );
};
