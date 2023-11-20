import React from 'react';
import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../..';

const BrandBar = () => {
  const { device } = useContext(Context);
  return (
    <ListGroup className="d-flex" style={{ position: 'sticky' }}>
      {device.brands.map(brand => (
        <ListGroup.Item
          style={{ cursor: 'pointer' }}
          active={brand.id === device.selectedBrand.id}
          key={brand.id}
          onClick={() => device.setSelectedBrand(brand)}
          action
        >
          {brand.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BrandBar;
