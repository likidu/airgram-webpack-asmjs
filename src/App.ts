import { Airgram } from '@airgram/web'
import { apiHash, apiId, jsLogVerbosityLevel, logVerbosityLevel } from './config'

const airgram = new Airgram({
  apiId,
  apiHash,
  jsLogVerbosityLevel,
  logVerbosityLevel
})

function syntaxHighlight (json:any) {
  if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match:any) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}

airgram.use(async (ctx, next) => {
  const logElement: HTMLElement = document.getElementById('log')!;
  if ('request' in ctx) {
    logElement.innerHTML += '<p> 🚀 [Airgram Request]:' + syntaxHighlight(ctx.request) + '</p>'
    console.log('🚀 [Airgram Request]:', ctx.request)
  } else if (ctx.update) {
    logElement.innerHTML += '<p> 🚀 [Airgram Update]:' + syntaxHighlight(ctx.update) + '</p>'
    console.log('🚀 [Airgram Update]:', ctx.update)
  }
  await next()
  if ('request' in ctx) {
    logElement.innerHTML += '<p> 🚀 [Airgram Response]:' + syntaxHighlight(ctx.response) + '</p>'
    console.log('🚀 [Airgram Response]:', ctx.request.method, ctx.response)
  }
})

export {
  airgram
}
