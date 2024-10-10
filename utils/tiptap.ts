interface PrepareEmailHtmlOptions {
    wrap?: string;
    baseUrl?: string;
}

export const injectEmailStyles = () => {
    return `<style>
    /* Reset styles */
    body, p, h1, h2, h3, h4, h5, h6, ul, ol, li, div, span, table, tr, td, th {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    
    /* Base styles */
    body {
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      background-color: #f6f6f6;
      color: #333333;
      font-family: Arial, sans-serif;
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 16px;
      font-weight: bold;
    }
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    h4 { font-size: 18px; }
    h5, h6 { font-size: 16px; }
    
    p, ul, ol {
      margin-bottom: 16px;
    }
    
    /* Links */
    a {
      color: #0066cc;
      text-decoration: underline;
    }
    
    /* Images */
    img {
      max-width: 100%;
      height: auto;
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Tables */
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 10px !important;
      }
    }
  </style>`
}

export const prepareEmailHtml = (html: string, { wrap = 'html', baseUrl = '' }: PrepareEmailHtmlOptions = {}) => {
    // TODO: Handle baseUrl
    html = html.replace(/tt-src/g, 'src')
    html = `${injectEmailStyles()}
  ${html}`
  
    html = `<${wrap}>${html}</${wrap}>`
  
    return html
  }