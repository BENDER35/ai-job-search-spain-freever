import { describe, test, expect } from "bun:test";
import {
  parseJobCards,
  parseJobDetail,
  parseTotal,
  provinceCode,
  provinceNames,
  workModeFlag,
  toIsoDate,
  decodeHtmlEntities,
} from "../src/helpers";
import { searchCard, searchPage, detailPage } from "./fixtures";

describe("parseJobCards contract fields", () => {
  test("extracts id, title, company, location, date, url from a real-shaped card", () => {
    const [card] = parseJobCards(
      searchPage([
        searchCard({
          hash: "rf-63cb1b5962204314d34f",
          path: "data-engineer-python-spark-airflow-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f",
          title: "Data Engineer Python/Spark/Airflow",
          company: "Grupo NS",
          location: "Sevilla",
          date: "16/10/2026",
          category: "Analista",
        }),
      ]),
    );

    expect(card.id).toBe(
      "data-engineer-python-spark-airflow-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f",
    );
    expect(card.title).toBe("Data Engineer Python/Spark/Airflow");
    expect(card.company).toBe("Grupo NS");
    expect(card.location).toBe("Sevilla");
    expect(card.date).toBe("2026-10-16");
    expect(card.url).toBe(
      "https://www.tecnoempleo.com/data-engineer-python-spark-airflow-grupo-ns/apache-airflow/rf-63cb1b5962204314d34f",
    );
  });

  test("company is null on an 'empresa confidencial' card (no company anchor)", () => {
    const [card] = parseJobCards(
      searchPage([
        searchCard({
          hash: "rf-aaa111",
          path: "frontend-react/rf-aaa111",
          title: "Frontend React",
          company: null,
          location: "Madrid",
          date: "15/10/2026",
        }),
      ]),
    );
    expect(card.company).toBeNull();
    expect(card.companyUrl).toBeNull();
  });

  test("decodes HTML entities in the title and company", () => {
    const [card] = parseJobCards(
      searchPage([
        searchCard({
          hash: "rf-bbb222",
          path: "analista/rf-bbb222",
          title: "Analista de Datos &amp; BI",
          company: "N&#xF8;rrebro Espa&ntilde;a",
          location: "M&aacute;laga",
          date: "15/10/2026",
        }),
      ]),
    );
    expect(card.title).toBe("Analista de Datos & BI");
    expect(card.company).toBe("Nørrebro España");
    expect(card.location).toBe("Málaga");
  });

  test("parses category, salary and the modality suffix from the right column", () => {
    const [card] = parseJobCards(
      searchPage([
        searchCard({
          hash: "rf-ccc333",
          path: "devops/rf-ccc333",
          title: "DevOps Engineer",
          company: "Acme",
          location: "Madrid",
          date: "16/10/2026",
          category: "DevOps",
          salary: "33.000&euro; - 39.000&euro; b/a",
          modality: "Híbrido",
        }),
      ]),
    );
    expect(card.category).toBe("DevOps");
    expect(card.salary).toBe("33.000€ - 39.000€ b/a");
    expect(card.workMode).toBe("Híbrido");
  });

  test("a '100% remoto' location implies a remote work mode", () => {
    const [card] = parseJobCards(
      searchPage([
        searchCard({
          hash: "rf-ddd444",
          path: "backend/rf-ddd444",
          title: "Backend Engineer",
          company: "Acme",
          location: "100% remoto",
          date: "16/10/2026",
        }),
      ]),
    );
    expect(card.location).toBe("100% remoto");
    expect(card.workMode).toBe("100% remoto");
  });

  test("parses a multi-region card whose right column omits the <b> wrapper", () => {
    // Live 2026-10-16: "España y otras" postings render the right column without
    // any <b> tag, so a location parser keyed on <b> left location/category null
    // on roughly a third of results.
    const [card] = parseJobCards(
      searchPage([
        `<a name="rf-abcd1234" id="rf-abcd1234"></a>
         <div class="p-3">
           <a href="https://www.tecnoempleo.com/desarrollador-web/rf-abcd1234" class="font-weight-bold text-cyan-700" title="Desarrollador Web">Desarrollador Web</a>
           <a title="Ofertas de Empleo Enerwise" href="https://www.tecnoempleo.com/enerwise/re-207392" class="text-primary link-muted">Enerwise</a>
           <span class="d-block d-lg-none text-gray-800">Espa&Ntilde;a y otras - 16/10/2026</span>
           <div class="col-12 col-lg-3 text-gray-700 pt-2 text-right hidden-md-down">
             16/10/2026 <span class="badge badge-warning ml-1 lead fs--11">Actualizada</span>
             <br><br>Espa&Ntilde;a y otras<br>Desarrollador Web<br>Contrato freelance/aut&oacute;nomo<br>
           </div>
         </div>`,
      ]),
    );
    expect(card.location).toBe("EspaÑa y otras");
    expect(card.category).toBe("Desarrollador Web");
    expect(card.employmentType).toBe("Contrato freelance/autónomo");
    expect(card.date).toBe("2026-10-16");
  });

  test("one malformed card does not break the following ones", () => {
    const good = searchCard({
      hash: "rf-eee555",
      path: "qa/rf-eee555",
      title: "QA Engineer",
      company: "Acme",
      location: "Barcelona",
      date: "14/10/2026",
    });
    // An empty card body: no title anchor, so the entry is skipped, not fatal.
    const broken = `<a name="rf-broken" id="rf-broken"></a><div class="p-3"></div>`;
    const cards = parseJobCards(searchPage([broken, good]));
    expect(cards).toHaveLength(1);
    expect(cards[0].title).toBe("QA Engineer");
  });

  test("date is null when no DD/MM/YYYY date appears on the card", () => {
    const [card] = parseJobCards(
      searchPage([
        `<a name="rf-fff666" id="rf-fff666"></a>
         <div class="p-3">
           <a href="https://www.tecnoempleo.com/x/rf-fff666" class="font-weight-bold text-cyan-700" title="Sin Fecha">Sin Fecha</a>
           <div class="col-12 col-lg-3 text-gray-700 pt-2 text-right hidden-md-down">
             <b>Madrid</b><br>Analista<br>
           </div>
         </div>`,
      ]),
    );
    expect(card.date).toBeNull();
    expect(card.location).toBe("Madrid");
    expect(card.category).toBe("Analista");
  });
});

describe("parseTotal", () => {
  test("reads the count from the page heading, stripping thousands separators", () => {
    expect(parseTotal("<h1>1.234 Ofertas de empleo de python</h1>")).toBe(1234);
  });

  test("returns 0 when there is no heading", () => {
    expect(parseTotal("<html></html>")).toBe(0);
  });
});

describe("toIsoDate", () => {
  test("converts DD/MM/YYYY to ISO YYYY-MM-DD", () => {
    expect(toIsoDate("01/02/2026")).toBe("2026-02-01");
  });

  test("returns null for missing or unparseable input", () => {
    expect(toIsoDate(null)).toBeNull();
    expect(toIsoDate("")).toBeNull();
    expect(toIsoDate("hoy")).toBeNull();
  });
});

describe("provinceCode", () => {
  test("resolves an accented province name", () => {
    expect(provinceCode("Málaga")).toBe(264);
  });

  test("resolves a common Castilian alias", () => {
    expect(provinceCode("Vizcaya")).toBe(241);
    expect(provinceCode("La Coruña")).toBe(231);
  });

  test("resolves a raw numeric code in range", () => {
    expect(provinceCode("263")).toBe(263);
  });

  test("returns null for an unknown name or an out-of-range code", () => {
    expect(provinceCode("Atlantis")).toBeNull();
    expect(provinceCode("999")).toBeNull();
  });

  test("provinceNames is non-empty (usable in error messages)", () => {
    expect(provinceNames().length).toBeGreaterThan(40);
  });
});

describe("workModeFlag", () => {
  test("maps English and Spanish spellings to the en_remoto values", () => {
    expect(workModeFlag("remote")).toBe("1");
    expect(workModeFlag("remoto")).toBe("1");
    expect(workModeFlag("teletrabajo")).toBe("1");
    expect(workModeFlag("onsite")).toBe("2");
    expect(workModeFlag("presencial")).toBe("2");
    expect(workModeFlag("hybrid")).toBe("3");
    expect(workModeFlag("híbrido")).toBe("3");
  });

  test("returns null for an unrecognised mode", () => {
    expect(workModeFlag("nope")).toBeNull();
    expect(workModeFlag(undefined)).toBeNull();
  });
});

describe("parseJobDetail", () => {
  const page = detailPage({
    title: "Desarrollador/a Python sobre GCP",
    company: "Arelance",
    description: "En Arelance buscamos perfiles Python.\n\nRequisitos: GCP.",
    datePosted: "2026-10-16",
    employmentType: "FULL_TIME",
    location: "Madrid",
    funciones: "Analista Programador",
    jornada: "Jornada completa",
    experiencia: "3-5 años",
    tipoContrato: "Indefinido",
    salary: { minValue: 33000, maxValue: 39000, unitText: "YEAR" },
    skills: ["python", "gcp", "cloud"],
    externalApply: false,
  });

  test("uses the caller's canonical id and url, never a page link", () => {
    const job = parseJobDetail(page, "https://www.tecnoempleo.com/slug/rf-1", "slug/rf-1");
    expect(job.id).toBe("slug/rf-1");
    expect(job.url).toBe("https://www.tecnoempleo.com/slug/rf-1");
  });

  test("maps the JSON-LD and sidebar fields", () => {
    const job = parseJobDetail(page, "https://www.tecnoempleo.com/slug/rf-1", "slug/rf-1");
    expect(job.title).toBe("Desarrollador/a Python sobre GCP");
    expect(job.company).toBe("Arelance");
    expect(job.location).toBe("Madrid");
    expect(job.category).toBe("Analista Programador");
    expect(job.employmentType).toBe("Jornada completa");
    expect(job.date).toBe("2026-10-16");
    expect(job.salary).toBe("33000 - 39000 EUR/año");
    expect(job.skills).toEqual(["python", "gcp", "cloud"]);
  });

  test("deadline is always null — Tecnoempleo exposes no deadline", () => {
    const job = parseJobDetail(page, "https://www.tecnoempleo.com/slug/rf-1", "slug/rf-1");
    expect(job.deadline).toBeNull();
  });

  test("builds the apply URL from the rf-<hash>", () => {
    const job = parseJobDetail(
      page,
      "https://www.tecnoempleo.com/slug/skills/rf-478e15e942b7f396ba44",
      "slug/skills/rf-478e15e942b7f396ba44",
    );
    expect(job.applyUrl).toBe(
      "https://www.tecnoempleo.com/validacion_enviar.php?refer=478e15e942b7f396ba44",
    );
  });

  test("falls back to the sidebar when the JSON-LD block is absent", () => {
    const noLd = `<html><body>
      <h1 itemprop="title">Analista de Datos</h1>
      <ul class="list-unstyled mb-0 fs--15">
        <li class="list-item clearfix border-bottom py-2">
          <span class="float-end"> Sevilla </span>
          <div class="badge badge-secondary"><i class="fi fi-pin"></i></div>
          <span class="d-inline-block px-2">Ubicación</span>
        </li>
        <li class="list-item clearfix border-bottom py-2">
          <span class="float-end"> Analista </span>
          <div class="badge badge-secondary"><i class="fi fi-users"></i></div>
          <span class="d-inline-block px-2">Funciones</span>
        </li>
        <li class="list-item clearfix border-bottom py-2">
          <span class="float-end"> Indefinido </span>
          <div class="badge badge-secondary"><i class="fi fi-task-list"></i></div>
          <span class="d-inline-block px-2">Tipo contrato</span>
        </li>
      </ul>
      <div itemprop="description">Una descripci&oacute;n.</div>
    </body></html>`;
    const job = parseJobDetail(noLd, "https://www.tecnoempleo.com/x/rf-2", "x/rf-2");
    expect(job.location).toBe("Sevilla");
    expect(job.category).toBe("Analista");
    expect(job.employmentType).toBe("Indefinido");
    expect(job.description).toBe("Una descripción.");
    expect(job.deadline).toBeNull();
  });

  test("reads the rendered description and preserves paragraph breaks", () => {
    // The description div nests its own <div>, and a lazy regex stops at the
    // inner close. The glued "Párrafo unoPárrafo dos" this produced was the
    // reason to make extraction depth-aware.
    const page = `<html><body>
      <h1 itemprop="title">Analista</h1>
      <div itemprop="description" class="mt-4">
        <h2 class="h5">Descripción de la oferta de empleo</h2>
        <div class="fs--16 text-gray-800">
          P&aacute;rrafo uno.<br/><br/>P&aacute;rrafo dos con <b>negrita</b>.<br/><br/>Requisitos:<ul><li>Python</li><li>SQL</li></ul>
        </div>
      </div>
    </body></html>`;
    const job = parseJobDetail(page, "https://www.tecnoempleo.com/x/rf-4", "x/rf-4");
    expect(job.description).toContain("Párrafo uno.");
    expect(job.description).toContain("Párrafo dos con negrita.");
    expect(job.description).toContain("Python");
    expect(job.description).toContain("SQL");
    // Paragraph breaks survive, and the heading is not part of the body.
    expect(job.description).toMatch(/Párrafo uno\.\n+Párrafo dos/);
    expect(job.description).not.toContain("Descripción de la oferta de empleo");
  });

  test("detects the external-apply notice", () => {
    const external = detailPage({
      title: "Analista",
      description: "x",
      externalApply: true,
    });
    const job = parseJobDetail(external, "https://www.tecnoempleo.com/x/rf-3", "x/rf-3");
    expect(job.externalApply).toBe(true);
  });
});

describe("decodeHtmlEntities", () => {
  test("decodes named, decimal and hex entities", () => {
    expect(decodeHtmlEntities("Caf&eacute; &#233; &#xE9;")).toBe("Café é é");
  });
});
