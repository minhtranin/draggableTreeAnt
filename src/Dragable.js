import React, { useCallback, useEffect, useState } from 'react'
import { Tree, Input, Select, Button } from 'antd';
import { FolderFilled } from "@ant-design/icons";
import InputAction from './component/InputAction'
import { v4 } from 'uuid'
const { Search } = Input;
const { Option } = Select;

const Folder = ({ name, type, handleSelect }) => {
    return <div
        className="g-folder"
        onClick={() => {
            if (typeof handleSelect === 'function') {
                handleSelect()
            }
        }}
    >
        <div>
            <span style={{ paddingLeft: "10px" }}>
                {name}
            </span>
        </div>
        <div>
            <span style={{
                paddingLeft: "10px", fontSize: "11px"
            }}>
                {type === 'all' ? 'Visible to Everyone' : 'Visible to specific users'}
            </span>

        </div>
    </div>
}

const treeData = [
    {
        title: "label",
        name: 'My folder name 1',
        allowers: ['lucy'],
        type: 'one',
        children: [
            {
                title: "label",
                name: 'My folder name 1-1',
                allowers: [],
                type: 'all',
                children: [
                    {
                        title: "label",
                        name: 'My folder name 1-1-1',
                        allowers: [],
                        type: 'all',
                    },
                ]
            },
        ],
    },
    {
        title: "label",
        name: 'My folder name 2',
        allowers: ['lucy'],
        type: 'one',
    },
];

const SearchTree = () => {
    const [searchValue, setSearchValue] = useState(undefined)
    const [open, setOpen] = useState(false)
    const [gData, setGData] = useState([])
    const [value, setValue] = useState(undefined)
    const [save, setSave] = useState(false)
    const [final, setFinal] = useState([])

    const helperFindPosition = useCallback((p) => {
        return p.split('-').reduce((i, v, idx) => {
            const init = i
            if (idx >= 1) {
                init.push(Number(v))
            }
            return init
        }, [])
    }, [])

    const helperGetItem = useCallback((p = []) => {
        return p.reduce((init, value, idex) => {
            if (idex === 0) {
                return init[value]
            } else {
                return init?.children?.[value]
            }
        }, gData)
    }, [gData])

    const helperDeleteItem = useCallback((p = []) => {
        const newDataAfterDel = [...gData]
        p.reduce((init, value, idex) => {
            if (idex === 0) {
                if (p.length === 1) init.splice(value, 1)
                return init[value]
            } else if (idex === (p.length - 1)) {
                init.children.splice(value, 1)
                return init.children
            } else {
                return init?.children?.[value]
            }
        }, newDataAfterDel)
        return newDataAfterDel
    }, [gData])

    const helperSaveItem = useCallback((p = [], params) => {
        const { name, type, allowers } = params
        const newDataAfterDel = [...gData]
        p.reduce((init, value, idex) => {
            if (idex === 0) {
                if (p.length === 1) {
                    init[value].title = 'label'
                    init[value].name = name
                    init[value].type = type
                    init[value].allowers = allowers
                }
                return init[value]
            } else if (idex === (p.length - 1)) {
                init.children[value].title = 'label'
                init.children[value].name = name
                init.children[value].type = type
                init.children[value].allowers = allowers
                return init?.children?.[value]
            } else {
                return init?.children?.[value]
            }
        }, newDataAfterDel)
        return newDataAfterDel
    }, [gData])

    const handleSelectTree = useCallback(((p) => {
        setOpen(false)
        setSave(false)
        const position = helperFindPosition(p)
        const info = helperGetItem(position)
        setValue({
            value: info.name,
            label: info.name,
            type: info.type,
            allowers: info.allowers
        })
    }), [helperFindPosition, helperGetItem])

    const makeup = useCallback((d, level = '0') => {
        const result = d.map((node, parentIdx) => {
            const { type, allowers, name, children, title } = node
            let newTitle = title
            let newChildren = children
            if (children) {
                newChildren = makeup(children, `${level}-${parentIdx}`)
            }
            return {
                title: newTitle,
                key: `${level}-${parentIdx}`,
                name,
                allowers,
                type,
                icon: <FolderFilled style={{ fontSize: "20px", paddingTop: "10px" }} />,
                ...children ? {
                    children: newChildren,
                } : {}
            }
        })
        return result
    }, [])

    const handleDel = useCallback((p) => {
        const position = helperFindPosition(p)
        const newDataAfterDel = helperDeleteItem(position)
        setGData([...makeup(newDataAfterDel)])

    }, [helperFindPosition, helperDeleteItem, makeup])

    const handleSav = useCallback((params, p) => {
        if (!params) return
        const position = helperFindPosition(p)
        const newDataAfterDel = helperSaveItem(position, params)
        console.log(newDataAfterDel, params)
        setGData([...makeup(newDataAfterDel)])

    }, [helperFindPosition, helperSaveItem, makeup])

    useEffect(() => {
        const newestData = makeup(treeData)
        setGData(newestData)
    }, [makeup])

    useEffect(() => {
        if (gData) {
            const afterMakeUp = (freshData) => {
                return freshData.map((fd) => {
                    const { title, children, key, allowers, name, type } = fd
                    let newChildren = ''
                    let newTitle = title
                    if (children) {
                        newChildren = afterMakeUp(children)
                    }
                    if (title === 'input') {
                        newTitle = <InputAction
                            key={v4()}
                            keyIndex={v4()}
                            type={type}
                            allowers={allowers}
                            handleSave={(params) => handleSav(params, key)}
                            handleDel={() => handleDel(key)}
                        />
                    }
                    if (title === 'label') {
                        newTitle = <Folder name={name} type={type} handleSelect={() => handleSelectTree(key)} />
                    }
                    return {
                        ...fd,
                        ...children ? {
                            children: newChildren,
                        } : {},
                        title: newTitle
                    }
                })
            }
            const finalData = afterMakeUp([...gData])
            setFinal(finalData)
        }
    }, [gData, handleDel, handleSelectTree, handleSav])

    const onDragEnter = info => {
    };

    const onDrop = info => {
        setValue(undefined)
        setSearchValue(undefined)
        setSave(false)
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...gData];

        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, item => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 &&
            info.node.props.expanded &&
            dropPosition === 1
        ) {
            loop(data, dropKey, item => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        setGData(makeup(data))
    };

    const handleAddFolder = () => {
        setSearchValue(undefined)
        const oldData = [...gData]
        const data = [
            {
                title: "input",
                name: '',
                allowers: [],
                type: gData.length > 4 ? 'all' : 'one',
            },
            ...oldData
        ];
        setGData(makeup(data))
    }

    const handleSearch = useCallback(({ target }) => {
        if (!target) return
        const text = target.value
        setSearchValue(text)
    }, [])

    const filter = useCallback((rawData) => {
        if (!searchValue) return rawData
        const filterFunc = (data) => {
            return data.filter((node) => {
                const { name, children } = node
                if (name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                    console.log('+++')
                    return true
                } else if (children) {
                    if (filterFunc(children).length) {
                        return true
                    }
                }
                return false
            })
        }
        return (filterFunc(rawData))
    }, [searchValue])

    return (
        <>
            <div style={{ width: "460px", margin: '30px auto', border: '1px solid #ded7d7', padding: '5px' }}>
                <Select
                    labelInValue
                    open={open}
                    style={{ width: 448 }}
                    onClick={(e) => {
                        const { className } = e.target
                        const targetClass = ['ant-select-selection-search-input']
                        if (targetClass.includes(className)) {
                            setOpen(!open)
                        }
                    }}
                    dropdownStyle={{
                        overflow: 'auto',
                        height: '460px',
                    }}
                    value={value}
                    placeholder="Please select"
                    dropdownRender={(menu) => {
                        return <div
                            style={{
                            }}
                        >
                            <div className="g-search-header">
                                <Search
                                    placeholder="Search"
                                    style={{ width: '269px' }}
                                    value={searchValue}
                                    onChange={(ev) => handleSearch(ev)}
                                />
                                <Button
                                    onClick={handleAddFolder}
                                >
                                    Add New Folder
                                </Button>
                            </div>
                            <Tree
                                className="draggable-tree"
                                defaultExpandAll
                                draggable
                                showIcon
                                blockNode
                                onDragEnter={onDragEnter}
                                onDrop={onDrop}
                                treeData={filter(final)}
                            />
                            {/* {menu} */}
                        </div>
                    }}
                >
                    <Option value="lucy">Lucy (101)</Option>
                </Select>
                <div className="g-action-parent">
                    <Button
                        onClick={() => {
                            setValue(undefined)
                            setSearchValue(undefined)
                            setSave(false)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!value}
                        onClick={() => setSave(true)}
                    >
                        Save
                    </Button>
                </div>
            </div>
            {save && <div style={{ width: "460px", margin: '30px auto', border: '1px solid #ded7d7', padding: '5px' }}>
                <h2>Folder info</h2>
                <div>
                    <span>{value.label}</span>
                    <br></br>
                    <span>{value.type === 'all' ? 'Visible to Everyone' : 'Visible to specific users'}</span>
                    <br></br>
                    <span>{!!value?.allowers?.length && `Visible to ${value.allowers.toString()}`}</span>
                </div>
            </div>}
        </>
    );
}

export default SearchTree