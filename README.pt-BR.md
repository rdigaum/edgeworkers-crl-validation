# Validação de Certificados de Cliente Revogados com Akamai EdgeWorkers (LCR - Lista de Certificados Revogados)

Este projeto demonstra como validar certificados de cliente (mTLS) via LCR (Lista de Certificados Revogados) usando **Akamai EdgeWorkers**, bloqueando o acesso para certificados revogados com base em um arquivo local (`data.js`). É ideal para cenários onde a política de segurança exige a validação de certificados diretamente na borda (edge).

## Funcionalidades

- Valida a presença do fingerprint do certificado via variável da Akamai ex.:`PMUSER_CLIENT_CERT_FINGERPRINT`
- Bloqueia certificados revogados com **HTTP 403** e resposta JSON
- Retorna **HTTP 401** quando nenhum certificado é apresentado
- Usa uma lista local (`data.js`) de fingerprints revogados (sem uso de EdgeKV)
- Executa diretamente via Property Manager (sem sandbox ou manifest.json)

## 📂 Estrutura do Projeto

```bash
├── main.js          # Lógica principal do EdgeWorker
├── data.js          # Lista local de fingerprints revogados
├── bundle.json      # Arquivo de manifesto com informações para o EdgeWorker
```

## Como Publicar na Akamai

1. Empacote o EdgeWorker

Acesse o diretório principal do projeto e crie o arquivo TAR

```bash
tar zcvf * ../crl.tgz
```

2. Envie o pacote para a Akamai

[Criando um EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/manage-edgeworkers)

3. Vincule no Property Manager

- Adicione o behavior **EdgeWorkers**
- Informe o EdgeWorker ID
- Crie uma regra de correspondência (ex: `/*` ou somente os path/endpoints que requer mTLS)
- Adicione a variável `PMUSER_CLIENT_CERT_FINGERPRINT` no Property Manager extraindo o fingerprint do certificado de cliente

[Link de Referência](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworkers-behavior)

4. Estrutura do `data.js`

```js
export const revokedFingerprints = [
  '15D21AE3FA1051EDEADC901C',
  '15D21AE3FA1051EDEADC821C'
];
```

## Exemplos de Resposta JSON

**401 - Certificado Não Encontrado**
```json
{
  "status": "nao_autorizado",
  "message": "Certificado de cliente não encontrado. Acesso negado!"
}
```

**403 - Certificado Revogado**
```json
{
  "status": "revogado",
  "message": "Este certificado foi revogado. Acesso negado."
}
```

## Recursos Relacionados

- [Visão Geral do EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/what-is-edgeworkers)
- [Funções de Manipulação de Evento](https://techdocs.akamai.com/edgeworkers/docs/event-handler-functions)
- [API JavaScript do EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/about-the-javascript-api)
- [Variáveis PMUSER](https://techdocs.akamai.com/property-mgr/docs/using-variables)
- [Repositório de Exemplos do EdgeWorkers](https://github.com/akamai/edgeworkers-examples)
- [Exemplo de Resposta Substituta](https://github.com/akamai/edgeworkers-examples/tree/master/edgecompute/examples/surrogate-response)

## Contribuições

Pull requests são bem-vindos! Fique à vontade para abrir issues e sugerir melhorias.

> Read this README in [English](./README.md)

## License

[MIT License](https://mit-license.org/)