import React, { useState, useRef, useEffect, createRef } from "react";
import { TreeSelect, Input, Select, Button, Tree } from "antd";
import { FolderFilled, DeleteTwoTone, SaveTwoTone } from "@ant-design/icons";
import "./styles.css";
const { TreeNode } = Tree;
const { Option } = Select;
const { Search } = Input;

const Model = () => {
  const treeData = [
    {
      title: "label",
      description: "Visible to Everyone",
      key: "0",
      default: "My folder name 1",
      children: [
        {
          title: "select",
          default: "all",
          key: "0-0",
          isLeaf: true
        },
        {
          title: "selectall",
          default: ["lucy"],
          key: "0-1",
          isLeaf: true
        },
        {
          title: "action",
          key: "0-2",
          isLeaf: true
        }
      ]
    }
  ];
  const newDataDefault = {
    title: "input",
    description: "Visible to Everyone",
    default: "",
    children: [
      {
        title: "select",
        default: "all",
        isLeaf: true
      },
      {
        title: "selectall",
        default: [],
        isLeaf: true
      },
      {
        title: "action",
        isLeaf: true
      }
    ]
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(undefined);
  const [data, setData] = useState(treeData);
  const [search, setSearch] = useState(undefined);
  const arrLength = data.length;
  const elRefs = useRef([]);

  useEffect(() => {
    if (elRefs.current.length !== arrLength) {
      elRefs.current = Array(arrLength)
        .fill()
        .map((_, i) => elRefs.current[i] || createRef());
    }
  }, [data, arrLength]);

  return (
    <div
      style={{
        width: "400px",
        margin: "30px auto",
        border: "1px solid grey",
        padding: "5px"
      }}
    >
      <TreeSelect
        treeIcon
        treeDefaultExpandAll
        listHeight={500}
        showSearch
        className="g-tree-select"
        value={value}
        onInputKeyDown={(e) => {
          e.preventDefault();
        }}
        filterTreeNode={(text, item) => {
          console.log(item);
          if (!data[item.value]) {
            return false;
            // const [idParent, idChildren] = item.value.split('-')
            // if (!data[idParent].children[idChildren].default) return false
            // console.log(data[idParent].children[idChildren].default)
            // return data[idParent].children[idChildren].default.toLowerCase().indexOf(text.toLowerCase()) !== -1
          }
          if (!data[item.value].default) return false;
          return (
            data[item.value].default
              .toLowerCase()
              .indexOf(text.toLowerCase()) !== -1 ||
            data[item.value].description
              .toLowerCase()
              .indexOf(text.toLowerCase()) !== -1
          );
        }}
        searchValue={search}
        dropdownRender={(prop) => {
          return (
            <>
              <div className="g-search-header">
                <Search
                  placeholder="Search"
                  style={{ width: "254px" }}
                  onChange={(ev) => {
                    const textSearch = ev.target.value;
                    setSearch(textSearch);
                  }}
                />
                <Button
                  onClick={() => {
                    const newData = [newDataDefault, ...data];
                    setData(newData);
                  }}
                >
                  Add New Folder
                </Button>
              </div>
              {prop}
            </>
          );
        }}
        style={{ marginBottom: 8, width: "100%" }}
        placeholder="Please select"
        open={open}
        onChange={(vl) => {
          setValue(vl);
          setOpen(false);
        }}
        onFocus={(e) => {
          setOpen(true);
          e.preventDefault();
        }}
        onBlur={() => {}}
      >
        {/* <Tree
         showIcon={false}
         selectable={false}
         draggable
         blockNode
         className="draggable-tree"
         key="000"
         title={'qweqwe'}
         onDragEnter={() => {
           console.log('++++')
         }}
          onDrop={() => {
            console.log('----')
          }}
        //  isLeaf
        > */}
        {data.map((item, index) => {
          return (
            <TreeNode
              key={index}
              value={index}
              icon={
                <FolderFilled
                  style={{ fontSize: "20px", paddingTop: "10px" }}
                />
              }
              isLeaf={item.title === "label"}
              selectable={item.title === "label"}
              title={
                <>
                  {item.title === "input" ? (
                    <>
                      <Input
                        style={{ width: "202px" }}
                        onClick={() => {
                          if (elRefs.current[index].current) {
                            elRefs.current[index].current.focus();
                          }
                        }}
                        ref={elRefs.current[index]}
                        placeholder="Enter new folder name"
                      />
                    </>
                  ) : (
                    <>
                      <span style={{ paddingLeft: "10px" }}>
                        {item.default}
                      </span>
                      <br></br>
                      <span style={{ paddingLeft: "35px", fontSize: "11px" }}>
                        {item.description}
                      </span>
                    </>
                  )}
                </>
              }
            >
              {item.title === "input" &&
                item.children.map((chil, cid) => {
                  return (
                    <TreeNode
                      key={`${index}-${cid}`}
                      selectable={false}
                      value={`${index}-${cid}`}
                      title={
                        <>
                          {chil.title === "select" ? (
                            <>
                              <Select
                                defaultValue={chil.default}
                                style={{ width: "202px" }}
                                onChange={(sc) => {
                                  const newData = data;
                                  newData[index].children[cid].default = sc;
                                  newData[index].children[cid + 1].default = [];
                                  const children = newData[
                                    index
                                  ].children.filter(
                                    (e) => e.title !== "selectall"
                                  );
                                  if (sc === "one") {
                                    newData[index].children = children;
                                    newData[index].description =
                                      "Visible to specific users";
                                  }
                                  if (sc === "all") {
                                    newData[index].description =
                                      "Visible to Everyone";
                                    newData[index].children = [
                                      children[0],
                                      newDataDefault.children[1],
                                      children[1]
                                    ];
                                  }
                                  setData([...newData]);
                                }}
                              >
                                <Option value="all">Visible to Everyone</Option>
                                <Option value="one">
                                  Visible to specific users
                                </Option>
                              </Select>
                            </>
                          ) : chil.title === "selectall" ? (
                            <>
                              <Select
                                defaultValue={chil.default}
                                placeholder="Select a name"
                                mode="multiple"
                                style={{ width: "202px" }}
                                onChange={(sla) => {
                                  const newData = data;
                                  newData[index].children[cid].default = sla;
                                  setData([...newData]);
                                }}
                              >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                              </Select>
                            </>
                          ) : chil.title === "action" ? (
                            <>
                              <div
                                className="g-action"
                                style={{
                                  width: "202px"
                                }}
                              >
                                <SaveTwoTone
                                  twoToneColor="#44AEA0"
                                  style={{ fontSize: "25px" }}
                                  onClick={() => {
                                    const newData = data;
                                    const folderName =
                                      elRefs.current[index].current.state.value;
                                    if (!folderName) return;
                                    newData[index].title = "label";
                                    newData[index].default = folderName;
                                    setData([...newData]);
                                  }}
                                />
                                <DeleteTwoTone
                                  twoToneColor="#D3455C"
                                  style={{ fontSize: "25px" }}
                                  onClick={() => {
                                    const newData = data.filter(
                                      (_, i) => index !== i
                                    );
                                    setData([...newData]);
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      }
                    />
                  );
                })}
            </TreeNode>
          );
        })}
        {/* </Tree> */}
      </TreeSelect>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "15px"
        }}
      >
        <Button
          onClick={() => {
            const newData = [newDataDefault, ...data];
            setData(newData);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            const newData = [newDataDefault, ...data];
            setData(newData);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Model;
