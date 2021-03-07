import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function AccountSelector({ onSelect = () => {}, accounts = [] }) {
  return (
    <div
      className="client-selector border rounded overflow-auto"
      style={{ maxHeight: "15rem" }}
    >
      <ListGroup variant="flush">
        {accounts.map((account, index) => (
          <ListGroup.Item action key={index} onClick={() => onSelect(account)}>
            <Row>
              <Col xs={5} className="font-weight-bold">
                {account.name}
              </Col>
              <Col xs={7} className="text-uppercase">
                {account.idType} {account.idNumber}
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
