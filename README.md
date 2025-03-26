# 🔐 CRL - Client Certificate Validation on Akamai EdgeWorkers

This project demonstrates how to validate client certificates (mTLS) via CRL using **Akamai EdgeWorkers**, blocking access for revoked certificates based on a local file (`data.js`). It is designed for use cases where Property Manager require certificate revocation checks at the Edge.

## Features

- Validates client certificate presence via Akamai Variables ex.: `PMUSER_CLIENT_CERT_FINGERPRINT`
- Blocks revoked certificates with **HTTP 403** and a custom JSON response
- Returns **HTTP 401** when no client certificate is provided with a custom JSON response
- Uses a local list (`data.js`) of revoked fingerprints (no EdgeKV dependency), but it could be extended using EdgeKV
- Works directly via Property Manager + EdgeWorkers

## 📂 Project Structure

```bash
├── main.js          # Main logic of the EdgeWorker
├── data.js          # Local list of revoked fingerprints
├── bundle.json      # Manifest file with metadata information
```

## How to Deploy on Akamai

1. Package the EdgeWorker

- Copy the project and enter on the main directory

```bash
tar zcvf * ../crl.tgz
```

2. Manage EdgeWorkers

[Create an EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/manage-edgeworkers)

3. Link it via Property Manager

- Add the **EdgeWorkers** behavior
- Set the EdgeWorker ID
- Add a match rule (example: `/*`)
- Add the `PMUSER_CLIENT_CERT_FINGERPRINT` variable via Property Manager

[Reference Link](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworkers-behavior)

4. Structure in `data.js`

```js
export const revokedFingerprints = [
  '15D21AE3FA1051EDEADC901C',
  '15D21AE3FA1051EDEADC821C'
];
```

## Example JSON Responses

**401 - No Client Certificate**
```json
{
  "status": "unauthorized",
  "message": "Client certificate not found. Access denied!"
}
```

**403 - Revoked Certificate**
```json
{
  "status": "revoked",
  "message": "This certificate has been revoked. Access denied."
}
```

## Related Resources

- [Akamai EdgeWorkers Overview](https://techdocs.akamai.com/edgeworkers/docs/what-is-edgeworkers)
- [EdgeWorkers Event Handlers](https://techdocs.akamai.com/edgeworkers/docs/event-handler-functions)
- [JavaScript API for EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/about-the-javascript-api)
- [PMUSER Variables](https://techdocs.akamai.com/property-mgr/docs/using-variables)
- [EdgeWorkers Examples Repository](https://github.com/akamai/edgeworkers-examples)
- [Surrogate Response Example](https://github.com/akamai/edgeworkers-examples/tree/master/edgecompute/examples/surrogate-response)

## Contributions

Pull requests are welcome! Feel free to open issues and suggest improvements.

> Read this README in [Português](./README.pt-BR.md)

## License

[MIT License](https://mit-license.org/)