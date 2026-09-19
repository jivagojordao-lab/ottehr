import { Immunization } from 'src/features/immunization/pages/Immunization';
import { InHouseLabOrderCreatePage } from 'src/features/in-house-labs/pages/InHouseLabOrderCreatePage';
import { InHouseLabTestDetailsPage } from 'src/features/in-house-labs/pages/InHouseLabOrderDetailsPage';
import { InHouseLabsPage } from 'src/features/in-house-labs/pages/InHouseLabsPage';
import { NursingOrderCreatePage } from 'src/features/nursing-orders/pages/NursingOrderCreatePage';
import { NursingOrderDetailsPage } from 'src/features/nursing-orders/pages/NursingOrderDetailsPage';
import { NursingOrdersPage } from 'src/features/nursing-orders/pages/NursingOrdersPage';
import { FEATURE_FLAGS } from '../../../../constants/feature-flags';
import { CreateExternalLabOrder } from '../../../external-labs/pages/CreateExternalLabOrder';
import { ExternalLabOrdersListPage } from '../../../external-labs/pages/ExternalLabOrdersListPage';
import { OrderDetailsPage } from '../../../external-labs/pages/OrderDetails';
import { ImmunizationOrderCreateEdit } from '../../../immunization/pages/ImmunizationOrderCreateEdit';
import {
  CreateExternalRadiologyOrder,
  EditExternalRadiologyOrder,
} from '../../../radiology/pages/CreateExternalRadiologyOrder';
import { CreateRadiologyOrder } from '../../../radiology/pages/CreateRadiologyOrder';
import { RadiologyExternalOrderDetailsPage } from '../../../radiology/pages/RadiologyExternalOrderDetails';
import { RadiologyOrderDetailsPage } from '../../../radiology/pages/RadiologyOrderDetails';
import { RadiologyOrdersListPage } from '../../../radiology/pages/RadiologyOrdersListPage';
import { AssessmentCard } from '../../shared/components/assessment-tab/AssessmentCard';
import { ExamTab } from '../../shared/components/exam-tab/ExamTab';
import { OttehrAi } from '../../shared/components/OttehrAi';
import { RosTab } from '../../shared/components/ros-tab/RosTab';
import { RouteInPerson } from '../context/InPersonNavigationContext';
import { Allergies } from '../pages/Allergies';
import { ChiefComplaintAndIntakeNotes } from '../pages/ChiefComplaintAndIntakeNotes';
import { ERXPage } from '../pages/ERXPage';
import { FollowUpNote } from '../pages/FollowUpNote';
import { HistoryAndTemplates } from '../pages/HistoryAndTemplates';
import { Hospitalization } from '../pages/Hospitalization';
import { InHouseMedication } from '../pages/InHouseMedication';
import { InHouseOrderEdit } from '../pages/InHouseOrderEdit';
import { InHouseOrderNew } from '../pages/InHouseOrderNew';
import { MedicalConditions } from '../pages/MedicalConditions';
import { Medications } from '../pages/Medications';
import { PatientVitals } from '../pages/PatientVitals';
import { Plan } from '../pages/Plan';
import Procedures from '../pages/Procedures';
import ProceduresNew from '../pages/ProceduresNew';
import { ProgressNote } from '../pages/ProgressNote';
import { Screening } from '../pages/Screening';
import { SurgicalHistory } from '../pages/SurgicalHistory';
import { VisitDocuments } from '../pages/VisitDocuments';

export enum ROUTER_PATH {
  CC_AND_INTAKE_NOTES = 'cc-and-intake-notes',
  REVIEW_AND_SIGN = 'review-and-sign',
  FOLLOW_UP_NOTE = 'follow-up-note',
  SCREENING = 'screening-questions',
  VITALS = 'vitals',
  ALLERGIES = 'allergies',
  MEDICATIONS = 'medications',
  MEDICAL_CONDITIONS = 'medical-conditions',
  SURGICAL_HISTORY = 'surgical-history',
  HOSPITALIZATION = 'hospitalization',
  IN_HOUSE_MEDICATION = 'in-house-medication/:tabName',
  IN_HOUSE_ORDER_NEW = 'in-house-medication/order/new',
  IN_HOUSE_ORDER_EDIT = 'in-house-medication/order/edit/:orderId',
  HISTORY_AND_TEMPLATES = 'history-of-present-illness-and-templates',
  REVIEW_OF_SYSTEMS = 'review-of-systems',
  ASSESSMENT = 'assessment',
  EXAMINATION = 'examination',
  PLAN = 'plan',
  ERX = 'erx',
  DOCUMENTS = 'documents',
  OTTEHR_AI = 'ottehr-ai',

  EXTERNAL_LAB_ORDER = 'external-lab-orders',
  EXTERNAL_LAB_ORDER_CREATE = `external-lab-orders/create`,
  EXTERNAL_LAB_ORDER_DETAILS = `external-lab-orders/:serviceRequestID/order-details`,
  EXTERNAL_LAB_ORDER_REPORT_DETAILS = `external-lab-orders/report/:diagnosticReportId/order-details`,

  RADIOLOGY_ORDER = 'radiology',
  RADIOLOGY_ORDER_CREATE = `radiology/create`,
  RADIOLOGY_ORDER_CREATE_EXTERNAL = `radiology/create-external`,
  RADIOLOGY_ORDER_DETAILS = `radiology/:serviceRequestID/order-details`,
  RADIOLOGY_ORDER_EXTERNAL_DETAILS = `radiology/:serviceRequestID/external-order-details`,
  RADIOLOGY_ORDER_EDIT_EXTERNAL = `radiology/:serviceRequestID/edit-external`,

  PROCEDURES = 'procedures',
  PROCEDURES_NEW = 'procedures/new',
  PROCEDURES_EDIT = 'procedures/:procedureId',

  IN_HOUSE_LAB_ORDERS = 'in-house-lab-orders',
  IN_HOUSE_LAB_ORDER_CREATE = `in-house-lab-orders/create`,
  IN_HOUSE_LAB_ORDER_DETAILS = `in-house-lab-orders/:serviceRequestID/order-details`,

  NURSING_ORDERS = 'nursing-orders',
  NURSING_ORDER_CREATE = 'nursing-orders/create',
  NURSING_ORDER_DETAILS = 'nursing-orders/:serviceRequestID/order-details',

  IMMUNIZATION = 'immunization/:tabName',
  IMMUNIZATION_ORDER_CREATE = 'immunization/order',
  IMMUNIZATION_ORDER_EDIT = 'immunization/order/:orderId',
}

export const routesInPerson: Record<ROUTER_PATH, RouteInPerson> = {
  [ROUTER_PATH.FOLLOW_UP_NOTE]: {
    path: ROUTER_PATH.FOLLOW_UP_NOTE,
    modes: ['follow-up'],
    element: <FollowUpNote />,
    text: 'Evolução / Retorno',
    iconKey: 'Progress Note',
  },
  [ROUTER_PATH.CC_AND_INTAKE_NOTES]: {
    path: ROUTER_PATH.CC_AND_INTAKE_NOTES,
    modes: ['main', 'readonly'],
    element: <ChiefComplaintAndIntakeNotes />,
    text: 'Queixa Principal',
    iconKey: 'Chief Complaint',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.SCREENING]: {
    path: ROUTER_PATH.SCREENING,
    modes: ['main', 'readonly'],
    element: <Screening />,
    text: 'Perguntas de Triagem',
    iconKey: 'Screening Questions',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.VITALS]: {
    path: ROUTER_PATH.VITALS,
    modes: ['main', 'readonly'],
    element: <PatientVitals />,
    text: 'Sinais Vitais',
    iconKey: 'Vitals',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.ALLERGIES]: {
    path: ROUTER_PATH.ALLERGIES,
    modes: ['main', 'readonly', 'follow-up'],
    element: <Allergies />,
    text: 'Alergias',
    iconKey: 'Allergies',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.MEDICATIONS]: {
    path: ROUTER_PATH.MEDICATIONS,
    modes: ['main', 'readonly', 'follow-up'],
    element: <Medications />,
    text: 'Medicamentos em Uso',
    iconKey: 'Medications',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.MEDICAL_CONDITIONS]: {
    path: ROUTER_PATH.MEDICAL_CONDITIONS,
    modes: ['main', 'readonly', 'follow-up'],
    element: <MedicalConditions />,
    text: 'Comorbidades',
    iconKey: 'Medical Conditions',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.SURGICAL_HISTORY]: {
    path: ROUTER_PATH.SURGICAL_HISTORY,
    modes: ['main', 'readonly', 'follow-up'],
    element: <SurgicalHistory />,
    text: 'Histórico Cirúrgico',
    iconKey: 'Surgical History',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.HOSPITALIZATION]: {
    path: ROUTER_PATH.HOSPITALIZATION,
    modes: ['main', 'readonly', 'follow-up'],
    element: <Hospitalization />,
    text: 'Internações Prévias',
    iconKey: 'Hospitalization',
    groupLabel: 'Triagem',
  },
  [ROUTER_PATH.IN_HOUSE_MEDICATION]: {
    path: ROUTER_PATH.IN_HOUSE_MEDICATION,
    sidebarPath: 'in-house-medication/mar',
    activeCheckPath: 'in-house-medication',
    modes: ['main', 'readonly', 'follow-up'],
    element: <InHouseMedication />,
    text: 'Medicamentos (Clínica)',
    iconKey: 'Med. Administration',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IN_HOUSE_ORDER_NEW]: {
    path: ROUTER_PATH.IN_HOUSE_ORDER_NEW,
    modes: ['main', 'readonly', 'follow-up'],
    isSkippedInNavigation: true,
    activeCheckPath: 'order/new',
    element: <InHouseOrderNew />,
    text: 'Medicamentos (Clínica)',
    iconKey: 'Med. Administration',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IN_HOUSE_ORDER_EDIT]: {
    path: ROUTER_PATH.IN_HOUSE_ORDER_EDIT,
    modes: ['main', 'readonly', 'follow-up'],
    isSkippedInNavigation: true,
    activeCheckPath: 'order/edit',
    element: <InHouseOrderEdit />,
    text: 'Medicamentos (Clínica)',
    iconKey: 'Med. Administration',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IN_HOUSE_LAB_ORDERS]: {
    path: ROUTER_PATH.IN_HOUSE_LAB_ORDERS,
    modes: FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    element: FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED ? <InHouseLabsPage /> : null,
    text: 'Exames Rápidos',
    iconKey: 'In-House Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IN_HOUSE_LAB_ORDER_CREATE]: {
    path: ROUTER_PATH.IN_HOUSE_LAB_ORDER_CREATE,
    modes: FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED ? <InHouseLabOrderCreatePage /> : null,
    text: 'Exames Rápidos',
    iconKey: 'In-House Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IN_HOUSE_LAB_ORDER_DETAILS]: {
    path: ROUTER_PATH.IN_HOUSE_LAB_ORDER_DETAILS,
    modes: FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.IN_HOUSE_LABS_ENABLED ? <InHouseLabTestDetailsPage /> : null,
    text: 'Exames Rápidos',
    iconKey: 'In-House Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.RADIOLOGY_ORDER]: {
    path: ROUTER_PATH.RADIOLOGY_ORDER,
    modes: FEATURE_FLAGS.RADIOLOGY_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    element: FEATURE_FLAGS.RADIOLOGY_ENABLED ? <RadiologyOrdersListPage /> : null,
    text: 'Radiologia & Imagem',
    iconKey: 'Radiology',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.RADIOLOGY_ORDER_CREATE]: {
    path: ROUTER_PATH.RADIOLOGY_ORDER_CREATE,
    modes: FEATURE_FLAGS.RADIOLOGY_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.RADIOLOGY_ENABLED ? <CreateRadiologyOrder /> : null,
    text: 'Radiologia & Imagem',
    iconKey: 'Radiology',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.RADIOLOGY_ORDER_CREATE_EXTERNAL]: {
    path: ROUTER_PATH.RADIOLOGY_ORDER_CREATE_EXTERNAL,
    modes: FEATURE_FLAGS.RADIOLOGY_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.RADIOLOGY_ENABLED ? <CreateExternalRadiologyOrder /> : null,
    text: 'Radiologia & Imagem',
    iconKey: 'Radiology',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.RADIOLOGY_ORDER_DETAILS]: {
    path: ROUTER_PATH.RADIOLOGY_ORDER_DETAILS,
    modes: FEATURE_FLAGS.RADIOLOGY_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.RADIOLOGY_ENABLED ? <RadiologyOrderDetailsPage /> : null,
    text: 'Radiologia & Imagem',
    iconKey: 'Radiology',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.RADIOLOGY_ORDER_EXTERNAL_DETAILS]: {
    path: ROUTER_PATH.RADIOLOGY_ORDER_EXTERNAL_DETAILS,
    modes: FEATURE_FLAGS.RADIOLOGY_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.RADIOLOGY_ENABLED ? <RadiologyExternalOrderDetailsPage /> : null,
    text: 'Radiologia & Imagem',
    iconKey: 'Radiology',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.RADIOLOGY_ORDER_EDIT_EXTERNAL]: {
    path: ROUTER_PATH.RADIOLOGY_ORDER_EDIT_EXTERNAL,
    modes: FEATURE_FLAGS.RADIOLOGY_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.RADIOLOGY_ENABLED ? <EditExternalRadiologyOrder /> : null,
    text: 'Radiologia & Imagem',
    iconKey: 'Radiology',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.PROCEDURES]: {
    path: ROUTER_PATH.PROCEDURES,
    modes: ['main', 'follow-up'],
    element: <Procedures />,
    text: 'Procedimentos',
    iconKey: 'Procedures',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.PROCEDURES_NEW]: {
    path: ROUTER_PATH.PROCEDURES_NEW,
    modes: ['main', 'follow-up'],
    isSkippedInNavigation: true,
    element: <ProceduresNew />,
    text: 'Registrar Procedimento',
    iconKey: 'Procedures',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.PROCEDURES_EDIT]: {
    path: ROUTER_PATH.PROCEDURES_EDIT,
    modes: ['main', 'follow-up'],
    isSkippedInNavigation: true,
    element: <ProceduresNew />,
    text: 'Editar Procedimento',
    iconKey: 'Procedures',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.NURSING_ORDERS]: {
    path: ROUTER_PATH.NURSING_ORDERS,
    modes: FEATURE_FLAGS.NURSING_ORDERS_ENABLED ? ['main', 'follow-up'] : [],
    element: FEATURE_FLAGS.NURSING_ORDERS_ENABLED ? <NursingOrdersPage /> : null,
    text: 'Ordens de Enfermagem',
    iconKey: 'Nursing Orders',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.NURSING_ORDER_CREATE]: {
    path: ROUTER_PATH.NURSING_ORDER_CREATE,
    modes: FEATURE_FLAGS.NURSING_ORDERS_ENABLED ? ['main', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.NURSING_ORDERS_ENABLED ? <NursingOrderCreatePage /> : null,
    text: 'Ordens de Enfermagem',
    iconKey: 'Nursing Orders',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.NURSING_ORDER_DETAILS]: {
    path: ROUTER_PATH.NURSING_ORDER_DETAILS,
    modes: FEATURE_FLAGS.NURSING_ORDERS_ENABLED ? ['main', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.NURSING_ORDERS_ENABLED ? <NursingOrderDetailsPage /> : null,
    text: 'Ordens de Enfermagem',
    iconKey: 'Nursing Orders',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IMMUNIZATION]: {
    path: ROUTER_PATH.IMMUNIZATION,
    sidebarPath: 'immunization/mar',
    activeCheckPath: 'immunization',
    modes: ['main', 'follow-up'],
    element: <Immunization />,
    text: 'Vacinas / Imunização',
    iconKey: 'Immunization',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IMMUNIZATION_ORDER_CREATE]: {
    path: ROUTER_PATH.IMMUNIZATION_ORDER_CREATE,
    modes: ['main', 'follow-up'],
    isSkippedInNavigation: true,
    element: <ImmunizationOrderCreateEdit />,
    text: 'Vacinas / Imunização',
    iconKey: 'Immunization',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.IMMUNIZATION_ORDER_EDIT]: {
    path: ROUTER_PATH.IMMUNIZATION_ORDER_EDIT,
    modes: ['main', 'follow-up'],
    isSkippedInNavigation: true,
    element: <ImmunizationOrderCreateEdit />,
    text: 'Vacinas / Imunização',
    iconKey: 'Immunization',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.EXTERNAL_LAB_ORDER]: {
    path: ROUTER_PATH.EXTERNAL_LAB_ORDER,
    modes: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    element: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? <ExternalLabOrdersListPage /> : null,
    text: 'Exames Laboratoriais',
    iconKey: 'External Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.EXTERNAL_LAB_ORDER_CREATE]: {
    path: ROUTER_PATH.EXTERNAL_LAB_ORDER_CREATE,
    modes: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? <CreateExternalLabOrder /> : null,
    text: 'Solicitar Exame',
    iconKey: 'External Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.EXTERNAL_LAB_ORDER_DETAILS]: {
    path: ROUTER_PATH.EXTERNAL_LAB_ORDER_DETAILS,
    modes: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? <OrderDetailsPage /> : null,
    text: 'Detalhes do Exame',
    iconKey: 'External Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.EXTERNAL_LAB_ORDER_REPORT_DETAILS]: {
    path: ROUTER_PATH.EXTERNAL_LAB_ORDER_REPORT_DETAILS,
    modes: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? ['main', 'readonly', 'follow-up'] : [],
    isSkippedInNavigation: true,
    element: FEATURE_FLAGS.LAB_ORDERS_ENABLED ? <OrderDetailsPage /> : null,
    text: 'Laudo do Exame',
    iconKey: 'External Labs',
    groupLabel: 'Prescrições & Pedidos',
  },
  [ROUTER_PATH.HISTORY_AND_TEMPLATES]: {
    path: ROUTER_PATH.HISTORY_AND_TEMPLATES,
    modes: ['main', 'readonly'],
    element: <HistoryAndTemplates />,
    text: 'Anamnese (HMA)',
    iconKey: 'History',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.REVIEW_OF_SYSTEMS]: {
    path: ROUTER_PATH.REVIEW_OF_SYSTEMS,
    modes: ['main', 'readonly'],
    element: <RosTab />,
    text: 'Interrogatório Sintomatológico',
    iconKey: 'Checklist',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.EXAMINATION]: {
    path: ROUTER_PATH.EXAMINATION,
    modes: ['main', 'readonly'],
    element: <ExamTab />,
    text: 'Exame Físico',
    iconKey: 'Stethoscope',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.ASSESSMENT]: {
    path: ROUTER_PATH.ASSESSMENT,
    modes: ['main', 'readonly'],
    element: <AssessmentCard />,
    text: 'Hipóteses Diagnósticas (CID-10)',
    iconKey: 'Prescription',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.PLAN]: {
    path: ROUTER_PATH.PLAN,
    modes: ['main', 'readonly', 'follow-up'],
    element: <Plan />,
    text: 'Conduta & Plano Terapêutico',
    iconKey: 'Lab profile',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.ERX]: {
    path: ROUTER_PATH.ERX,
    modes: ['main', 'readonly', 'follow-up'],
    element: <ERXPage />,
    text: 'Prescrição Memed',
    iconKey: 'eRX',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.DOCUMENTS]: {
    path: ROUTER_PATH.DOCUMENTS,
    modes: ['main', 'readonly', 'follow-up'],
    element: <VisitDocuments />,
    text: 'Atestados & Documentos',
    iconKey: 'Documents',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.REVIEW_AND_SIGN]: {
    path: ROUTER_PATH.REVIEW_AND_SIGN,
    modes: ['main', 'readonly'],
    element: <ProgressNote />,
    text: 'Revisar & Assinar',
    iconKey: 'Review & Sign',
    groupLabel: 'Atendimento Médico',
  },
  [ROUTER_PATH.OTTEHR_AI]: {
    path: ROUTER_PATH.OTTEHR_AI,
    modes: ['main', 'readonly'],
    element: <OttehrAi />,
    text: 'Assistente IA',
    iconKey: 'Oystehr AI',
    groupLabel: 'Recursos Adicionais',
  },
};
