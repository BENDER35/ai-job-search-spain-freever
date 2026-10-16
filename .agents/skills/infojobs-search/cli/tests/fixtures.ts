import type { InfoJobsOffer, InfoJobsOfferDetail, InfoJobsSearchResponse } from "../src/helpers";

// Fixture builders mirroring the shapes in the InfoJobs API docs (offer-list-9,
// offer-get-7; captured 2026-10-16). The docs' own examples are used verbatim
// where possible so the fixtures stay faithful.

/** One offer as returned by `GET /api/9/offer` (the search operation). */
export function offer(overrides: Partial<InfoJobsOffer> = {}): InfoJobsOffer {
  return {
    id: "258eae420249ffa67cf64681a2ef80",
    title: "Camareros/as y 2º de Sala Zona Penedès",
    province: { id: 9, value: "Barcelona" },
    city: "Vilafranca del Penedès",
    link: "https://www.infojobs.net/vilafranca-del-penedes/camareros-2-sala-zona-penedes/of-i258eae420249ffa67cf64681a2ef80",
    category: { id: 160, value: "Turismo y restauración" },
    subcategory: { id: 3116, value: "Restauración" },
    contractType: { id: 5, value: "Otros contratos" },
    salaryMin: { id: 10, value: "12 €" },
    salaryMax: { id: 10, value: "12 €" },
    salaryPeriod: { id: 1, value: "Bruto/hora" },
    experienceMin: { id: 6, value: "Al menos 2 años" },
    workDay: { id: 1, value: "Completa" },
    study: { id: 50, value: "Bachillerato" },
    teleworking: { id: 1, value: "Presencial" },
    published: "2023-05-09T14:04:02.000Z",
    updated: "2023-05-09T14:04:02.000Z",
    author: {
      id: "8275252453610761051133485087",
      name: "ADECCO",
      uri: "https://adecco.ofertas-trabajo.infojobs.net",
    },
    requirementMin: "-Experiencia como camarero/a o segundo de Sala.\r\n- Nivel de Inglés alto.",
    bold: false,
    applications: "0",
    executive: false,
    salaryDescription: "12€ - 12€ Bruto/hora",
    multiProvince: false,
    ...overrides,
  };
}

/** The `GET /api/9/offer` response envelope. */
export function searchResponse(
  offers: InfoJobsOffer[],
  overrides: Partial<InfoJobsSearchResponse> = {},
): InfoJobsSearchResponse {
  return {
    offers,
    totalResults: offers.length,
    currentResults: offers.length,
    totalPages: 1,
    currentPage: 1,
    pageSize: 20,
    ...overrides,
  };
}

/** One offer as returned by `GET /api/7/offer/{offerId}` (the detail operation). */
export function detailResponse(overrides: Partial<InfoJobsOfferDetail> = {}): InfoJobsOfferDetail {
  return {
    id: "8e55718e6d4282979b59a20017186d",
    title: "Adjunto Responsable de Tienda y Colaboradores",
    state: 1,
    creationDate: "2012-03-13T23:00:00.000+0000",
    updateDate: "2012-03-14T08:43:36.000+0000",
    city: "Fuenlabrada",
    externalUrlForm: "",
    applications: 0,
    province: { id: 33, value: "Madrid" },
    experienceMin: { id: 6, value: "Al menos 2 años" },
    category: { id: 10, value: "Administración de empresas" },
    subcategories: [{ id: 3000, value: "Administración", key: "administracion", parent: 10 }],
    studiesMin: { id: 120, value: "Ingeniero Técnico" },
    country: { id: 17, value: "España" },
    contractType: { id: 1, value: "Indefinido" },
    journey: { id: 1, value: "Completa" },
    profile: {
      id: "659ee7e1-c456-4db6-980c-ed19a94eab0d",
      name: "Empresa ejemplo",
      description: "Somos una empresa multinacional alemana líder en el sector de la distribución.",
      province: { id: 9, value: "Barcelona" },
      numberWorkers: 3000,
      hidden: true,
    },
    zipCode: "08800",
    vacancies: 1,
    minRequirements: "",
    description:
      "En dependencia del Responsable de Zona, el candidato a ADJUNTO DE RESPONSABLE DE TIENDA se responsabilizará de alcanzar en su tienda la mayor cifra de ventas.",
    desiredRequirements: "- Alto grado de responsabilidad y autonomía.\n- Capacidad de decisión y trabajo.",
    referenceId: "",
    contractDuration: "",
    showPay: true,
    maxPay: { amount: 27000, amountId: 275, periodId: 3, periodValue: "Bruto/año", amountValue: "27.000 €" },
    minPay: { amount: 24000, amountId: 270, periodId: 3, periodValue: "Bruto/año", amountValue: "24.000 €" },
    schedule: "",
    jobLevel: { id: 3, value: "Especialista" },
    link: "https://www.infojobs.net/fuenlabrada/oferta-multi-color-oculta/of-i8e55718e6d4282979b59a20017186d",
    active: true,
    archived: false,
    deleted: false,
    disponibleForFullVisualization: true,
    availableForVisualization: true,
    skillsList: [{ skill: "Java" }, { skill: "JSP" }],
    ...overrides,
  };
}
