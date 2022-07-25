import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import './App.css';

const columns = [
  {
    title: 'Protocol',
    dataIndex: 'name',
    key: 'name',
    render: (val: any, obj: any) => (
      <a target={'_blank'} href={obj.url}>
        {val}
      </a>
    ),
  },
  {
    title: 'TVL',
    dataIndex: 'tvl',
    key: 'tvl',
  },

  {
    title: 'Yields adapter',
    dataIndex: 'yields',
    key: 'yields',
    render: (val: any, obj: any) => {
      if (val) return <Tag color={'green'}>YES</Tag>;
      return <Tag color={'red'}>NO</Tag>;
    },
  },
];

function App() {
  const [adaptors, setAdaptors] = useState([]);
  const [protocols, setProtocols] = useState([]);
  useEffect(() => {
    fetch(
      'https://api.github.com/repos/DefiLlama/yield-server/git/trees/master?recursive=1'
    )
      .then((res) =>
        res.json().then((res) =>
          setAdaptors(
            res.tree
              .filter(
                ({ path }: any) =>
                  path.includes('adaptors') &&
                  (path.includes('index.js') ||
                    path.includes('index.ts'))
              )
              .map((adaptor: any) => ({
                ...adaptor,
                slug: adaptor.path.split('/')[2],
              }))
          )
        )
      )
      .then(() => {
        fetch('https://api.llama.fi/protocols').then((res) =>
          res.json().then((protocolsRes) => {
            const normalizedProtocols = protocolsRes
              .sort((protocolA: any, protocolB: any) =>
                protocolA.tvl > protocolB.tvl ? -1 : 1
              )
              .filter(
                (protocol: any) =>
                  !['Chain', 'Bridge'].includes(protocol.category)
              )
              .map((protocol: any) => ({
                ...protocol,
                yields: !!adaptors.find(
                  (adaptor: any) => adaptor.slug === protocol.slug
                ),
              }));
            setProtocols(normalizedProtocols);
          })
        );
      });
  }, [adaptors.length]);

  return (
    <div className="App">
      <h1 style={{ marginBottom: 20 }}>
        DefiLlama yields adapters coverage
      </h1>
      <Table
        columns={columns}
        dataSource={protocols}
        rowClassName={(record: any, index) =>
          record.yields ? '' : 'uncovered'
        }
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}

export default App;
