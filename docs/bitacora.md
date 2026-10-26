# Bitácora del loop de construcción — Hub

Registro append-only, una entrada por iteración. El backlog está en
[backlog.md](backlog.md) y el protocolo en
[.claude/commands/tdd.md](../.claude/commands/tdd.md).

**Para qué sirve:** una entrada sin la salida del comando pegada textualmente
**es** el delirio. Se detecta de un vistazo, sin tener que releer el diff.

Nunca se edita ni se reordena una entrada anterior. Si algo salió mal, se agrega
una entrada nueva que lo corrige.

**Formato:** ítem · archivos tocados · comando del gate · salida del rojo →
salida del verde · sha.

---

## H0 — Harness y estructura · 2026-10-26

**Archivos:** `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.js`,
`vite.config.ts`, `index.html`, `src/main.tsx`, `src/version.ts`, `src/vite-env.d.ts`,
`tests/harness.test.ts`, `.gitattributes`, `.gitignore`, `.claude/settings.json`,
`.claude/commands/tdd.md`, `CLAUDE.md`, `README.md`, `docs/adr/` (0000 a 0007 y el índice),
`docs/conceptos.md`, `docs/backlog.md`, `docs/bitacora.md`.

**Gate:** `npm run gate`

**El gate sabe ponerse rojo.** Con un hallazgo de lint puesto a propósito
(`export const VERSION: any = '0.0.0';` en `src/version.ts`: `tsc` lo deja pasar, el lint no):

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


P:\hub\src\version.ts
  1:23  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 1 problem (1 error, 0 warnings)

EXIT=1
```

**Verde**, con el hallazgo sacado:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


 RUN  v5.0.5 P:/hub


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:10:49
   Duration  122ms (transform 56%, import 24%, worker 11%, tests 8%, environment 1%)

vite v8.3.5 building client environment for production...
transforming...
✓ 14 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.31 kB │ gzip:  0.22 kB
dist/assets/index-CkS-kbAU.js  219.50 kB │ gzip: 68.58 kB

✓ built in 75ms
EXIT=0
```

**Nota:** H0 lo dejó armado la sesión de preparación, no una iteración del
loop. La primera iteración real del loop es **H1**.

**Sha:** pendiente: el commit de H0 no puede contener su propio sha. Lo completa el commit
siguiente.
