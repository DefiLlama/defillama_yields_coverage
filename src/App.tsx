import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import millify from 'millify';
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
  const [pools, setPools] = useState([]);
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
      })
      .then(() =>
        fetch('https://yields.llama.fi/pools').then((res) =>
          res.json().then(({ data }) => setPools(data))
        )
      );
  }, [adaptors.length]);

  const protocolsNames = new Set(pools.map(({ project }) => project));

  return (
    <div className="App">
      <h1 style={{ marginBottom: 8 }}>DefiLlama yield adapters</h1>
      <div>
        <h2 style={{ marginBottom: 8 }}>
          Protocols covered:
          {'  '}
          {protocolsNames.size}
        </h2>
        <h2 style={{ marginBottom: 8 }}>
          Pools TVL:
          {'  '}$
          {millify(
            pools.reduce((acc, { tvlUsd }) => acc + tvlUsd, 0),
            {
              precision: 2,
            }
          )}
        </h2>
        <h2 style={{ marginBottom: 8 }}>
          Pools number:
          {'  '}
          {pools.length}
        </h2>
        <h2 style={{ marginBottom: 16 }}>
          $1M Pools number:
          {'  '}
          {pools.filter(({ tvlUsd }) => tvlUsd > 1_000_000).length}
        </h2>
      </div>
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
