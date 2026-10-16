// Fixture builders mirroring Tecnoempleo's real server-rendered markup (captured
// live 2026-10-16). Each job card is a `.p-3.border.rounded` block preceded by an
// empty `<a name="rf-<hash>"></a>` anchor; the detail page carries a schema.org
// JobPosting JSON-LD block plus a sidebar `<li class="list-item">` list.

export interface SearchCardSpec {
  hash: string;
  path: string; // the slug/skills path after the host
  title: string;
  company?: string | null; // null/omitted => "empresa confidencial"
  location: string;
  date: string; // DD/MM/YYYY
  category?: string;
  salary?: string;
  modality?: string; // Híbrido | Presencial | Teletrabajo
  snippet?: string;
}

/** One search-results card, in the portal's exact structure. */
export function searchCard(spec: SearchCardSpec): string {
  const url = `https://www.tecnoempleo.com/${spec.path}`;
  const companyAnchor =
    spec.company == null
      ? ""
      : `<a title="Ofertas de Empleo ${spec.company}" href="https://www.tecnoempleo.com/${spec.company
          .toLowerCase()
          .replace(/\s+/g, "-")}-trabajo" class="text-primary link-muted">${spec.company}</a>`;
  const modality = spec.modality ? `(${spec.modality})` : "";
  const rightLines = [
    spec.category ?? "",
    spec.salary ?? "",
  ]
    .filter(Boolean)
    .map((l) => `${l}<br>`)
    .join("");
  return `<a name="${spec.hash}" id="${spec.hash}"></a>
    <div class="p-3 border rounded mb-3 bg-white">
      <div class="row fs--15">
        <div class="col-10 col-md-9 col-lg-7">
          <h3 class="fs-5 mb-2">
            <a href="${url}" class="font-weight-bold text-cyan-700" title="${spec.title}">
              ${spec.title}
            </a>
          </h3>
          ${companyAnchor}
          <span class="d-block d-lg-none text-gray-800">
            <b>${spec.location}</b> - ${spec.date}
          </span>
          <span class="hidden-md-down text-gray-800">
            <br>${spec.snippet ?? "Descripcion de la oferta"}<br><span class="badge bg-gray-500 mx-1">python</span>
          </span>
        </div>
        <div class="col-12 col-lg-3 text-gray-700 pt-2 text-right hidden-md-down">
          ${spec.date}
          <br><br><b>${spec.location}</b>${modality}<br>${rightLines}
        </div>
      </div>
    </div>`;
}

/** A results page wrapping the given cards, with the portal's `<h1>` total. */
export function searchPage(cards: string[], total = cards.length): string {
  return `<html><body>
    <h1>${total} Ofertas de empleo</h1>
    ${cards.join("\n")}
  </body></html>`;
}

export interface DetailSpec {
  title: string;
  company?: string;
  description?: string;
  datePosted?: string;
  employmentType?: string;
  salary?: { minValue?: number; maxValue?: number; currency?: string; unitText?: string };
  location?: string;
  funciones?: string;
  jornada?: string;
  experiencia?: string;
  tipoContrato?: string;
  salaryText?: string;
  skills?: string[];
  externalApply?: boolean;
}

/** One sidebar row (`<li class="list-item …">`). */
function sidebarRow(label: string, value: string, icon = "fi-pin"): string {
  return `<li class="list-item clearfix border-bottom py-2">
      <span class="float-end"> ${value} </span>
      <div class="badge badge-secondary badge-soft badge-ico-sm rounded-circle float-start">
        <i class="fi ${icon}"></i>
      </div>
      <span class="d-inline-block px-2">${label}</span>
    </li>`;
}

/** A detail page: JSON-LD (optional) + sidebar + skills. */
export function detailPage(spec: DetailSpec): string {
  const ld: Record<string, unknown> = {
    "@type": "JobPosting",
    title: spec.title,
  };
  if (spec.description !== undefined) ld.description = spec.description;
  if (spec.datePosted) ld.datePosted = spec.datePosted;
  if (spec.employmentType) ld.employmentType = spec.employmentType;
  if (spec.company) ld.hiringOrganization = { name: spec.company };
  if (spec.location) ld.jobLocation = { address: { addressLocality: spec.location } };
  if (spec.salary) ld.baseSalary = { value: spec.salary, currency: spec.salary.currency ?? "EUR" };

  const sidebar = [
    spec.location ? sidebarRow("Ubicación", spec.location, "fi-pin") : "",
    spec.funciones ? sidebarRow("Funciones", spec.funciones, "fi-users") : "",
    spec.jornada ? sidebarRow("Jornada", spec.jornada, "fi-calendar") : "",
    spec.experiencia ? sidebarRow("Experiencia", spec.experiencia, "fi-shield-ok") : "",
    spec.tipoContrato ? sidebarRow("Tipo contrato", spec.tipoContrato, "fi-task-list") : "",
    spec.salaryText ? sidebarRow("Salario", spec.salaryText, "fi-plus") : "",
  ]
    .filter(Boolean)
    .join("\n");

  const skillButtons = (spec.skills ?? [])
    .map(
      (s) =>
        `<a href="https://www.tecnoempleo.com/ofertas-trabajo/${s.toLowerCase()}" title="Ofertas de Empleo de ${s}">
          <button type="button" class="btn btn-primary btn-soft p-1 fs--14 mx-1">${s}</button>
        </a>`,
    )
    .join("");

  const externalNotice = spec.externalApply
    ? "<p>En esta oferta serás redirigido a la pagina web de la empresa.</p>"
    : "";

  return `<html><head>
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    </head><body>
    <h1 itemprop="title">${spec.title}</h1>
    <ul class="list-unstyled mb-0 fs--15">${sidebar}</ul>
    <li class="list-item clearfix">
      <i class="fi fi-code"></i>
      <div class="pl--12 pr--12">${skillButtons}</div>
    </li>
    <div itemprop="description"><br>Descripcion de la oferta</div>
    ${externalNotice}
    </body></html>`;
}
