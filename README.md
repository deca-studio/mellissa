# Melissa • 3 anos — Convite + RSVP

Convite digital responsivo baseado no conceito visual tropical aprovado, com três ações interativas:

- **Localização:** Google Maps ou Waze.
- **Horário:** Google Agenda ou arquivo `.ics`.
- **Confirmação:** formulário RSVP com nome, e-mail, telefone e acompanhante opcional.

## Configurar endereço e data

Edite `EVENT_CONFIG` no início de `script.js`:

```js
const EVENT_CONFIG = {
  title: 'Melissa • 3 anos',
  description: 'Aniversário de 3 anos da Melissa',
  address: 'ENDEREÇO COMPLETO',
  start: 'YYYYMMDDTHHMMSSZ',
  end: 'YYYYMMDDTHHMMSSZ'
};
```

## RSVP por e-mail

O formulário usa FormSubmit e encaminha as confirmações para `gener4ligris@gmail.com`.
Na primeira submissão, o FormSubmit pode solicitar ativação no e-mail de destino. Após a ativação, os próximos RSVPs são encaminhados normalmente.

## Publicação

Projeto estático pronto para Vercel, Netlify, GitHub Pages ou outro host de arquivos estáticos.
