// or JSON
export const treeData = {
    "name": "1",
    "value": 15,
    "type": "black",
    "level": "yellow",
    "children": [
      {
        "name": "1-2-1",
        "value": 10,
        "type": "grey",
        "level": "red"
      },
      {
        "name": "1-9",
        "value": 10,
        "type": "grey",
        "level": "red",
        "children": [
          {
            // No-convention
            "name": "1-9-001",
            "value": 7.5,
            "type": "grey",
            "level": "purple"
          },
          {
            "name": "1-9-002",
            "value": 7.5,
            "type": "grey",
            "level": "purple"
          }
        ]
      },
      {
        "name": "1-239872",
        "value": 10,
        "type": "grey",
        "level": "blue"
      },
      {
        "name": "1-42",
        "value": 10,
        "type": "grey",
        "level": "green",
        "children": [
          {
            "name": "Enoch",
            "value": 7.5,
            "type": "grey",
            "level": "orange"
          }
        ]
      },
      {
        "name": "9",
        "value": 10,
        "type": "grey",
        "level": "blue",
        "children": [
          {
            // No-convention
            // Random node clone
            "name": "1-9-001",
            "value": 7.5,
            "type": "grey",
            "level": "purple"
            // Data ID to interlink?
          }
        ]
      },
    ]
  };