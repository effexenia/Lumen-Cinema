const printableTicketCss = `
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .ticket {
    width: 380px;
    min-height: 260px;
    padding: 24px;
    border: 2px solid #000;
    border-radius: 8px;
    background-color: #fff;
    color: #000;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    position: relative;
  }

  .header {
    text-align: center;
    border-bottom: 2px dashed #000;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .header h1 {
    font-size: 28px;
    margin: 0;
    letter-spacing: 2px;
  }

  .movie {
    font-size: 18px;
    font-weight: 600;
    margin-top: 8px;
    text-transform: uppercase;
  }

  .datetime {
    font-size: 14px;
    color: #333;
    margin-top: 4px;
  }

  .details {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .info {
    font-size: 14px;
    line-height: 1.6;
    width: 60%;
  }

  .info p {
    margin: 4px 0;
  }

  .qr {
    width: 120px;
    text-align: center;
  }

  .qr svg {
    border: 1px solid #000;
    padding: 4px;
  }

  .footer {
    text-align: center;
    font-size: 12px;
    border-top: 2px dashed #000;
    padding-top: 10px;
    color: #555;
  }

  .ticket::after,
  .ticket::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #000;
    top: 50%;
    transform: translateY(-50%);
  }

  .ticket::after {
    left: -10px;
  }

  .ticket::before {
    right: -10px;
  }
`;

export default printableTicketCss;
