import React, { useEffect, useState } from "react";
import client from "../utils/client";
import { Card } from "react-bootstrap";

const KnownAddresses = () => {
  const [knownAddresses, setKnownAddresses] = useState(null);

  useEffect(() => {
    client
      .get("/addresses")
      .then((res) => setKnownAddresses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Card className="KnownAddresses">
      <Card.Body>
        <Card.Title>Known Adresses</Card.Title>
        {knownAddresses &&
          knownAddresses.map((address) => (
            <Card.Text key={address}>
              <hr />
              {address}
            </Card.Text>
          ))}
      </Card.Body>
    </Card>
  );
};

export default KnownAddresses;
