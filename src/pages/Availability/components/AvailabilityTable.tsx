import { useState } from "react";
import { VerticalCenterContainer } from "../../../common/styles";
import {
  AvailabilityTime,
  AvailabilityTableContainer,
  AvailabilityItemKey,
  AvailabilityTableRow,
  AvailabilityValue,
  AvailabilityValueContainer,
  EmptyBlock,
  BluredBlock,
} from "../style";

interface AvailabilityTableI {}

const data = [
  {
    id: 0,
    time: "09:00 AM -10:00 PM",
    list: [
      2, 2, 2, 2, 2, 0, 2, 0.1, 1.5, 0, 2, 2, 2, 2, 1.3, 1, 2, 1.6, 0.1, 1.3, 0,
      2, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2, 1.3,
      0,
    ],
  },
  {
    id: 1,
    time: "09:00 AM -10:00 PM",
    list: [
      0, 2, 1, 2, 2, 1.6, 2, 1.5, 2, 2, 0, 2, 2, 1.3, 0.1, 2, 2, 0, 2, 2, 1.3,
      0.1, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2,
      1.3, 0,
    ],
  },
  {
    id: 2,
    time: "09:00 AM -10:00 PM",
    list: [
      2, 1.3, 0, 2, 2, 2, 0.1, 1, 0, 2, 1.6, 1.3, 1.5, 0, 2, 2, 2, 2, 0.1, 2, 2,
      2, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2, 1.3,
      0,
    ],
  },
  {
    id: 3,
    time: "09:00 AM -10:00 PM",
    list: [
      2, 2, 2, 1.6, 2, 1, 1.3, 0.1, 2, 0.1, 2, 2, 2, 2, 1.3, 0, 2, 2, 0, 0, 1.5,
      2, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2, 1.3,
      0,
    ],
  },
  {
    id: 4,
    time: "09:00 AM -10:00 PM",
    list: [
      2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 1.3, 0, 1.3, 2, 0.1, 2, 1.6, 2, 1.5, 0.1, 1,
      2, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2, 1.3,
      0,
    ],
  },
  {
    id: 5,
    time: "09:00 AM -10:00 PM",
    list: [
      1.3, 2, 1, 1.6, 2, 1.3, 2, 1.5, 2, 2, 2, 0, 0.1, 2, 0, 2, 2, 2, 0, 2, 2,
      0.1, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2,
      1.3, 0,
    ],
  },
  {
    id: 6,
    time: "09:00 AM -10:00 PM",
    list: [
      2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2, 1.3, 0,
      2, 2, 2, 2, 1.3, 2, 0, 2, 2, 2, 1, 2, 1.5, 0, 0.1, 0.1, 1.6, 2, 2, 2, 1.3,
      0,
    ],
  },
];

const AvailabilityTable = ({}: AvailabilityTableI) => {
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const maxLength = Math.max(...data.map((item) => item.list.length));

  const keys = Array.from({ length: maxLength }, (_, index) => index);

  const handleSelectColumn = (ind: number) => () =>
    setSelectedKey(ind === selectedKey ? null : ind);

  const handleSelectRow = (ind: number) => () =>
    setSelectedTime(ind === selectedTime ? null : ind);

  return (
    <AvailabilityTableContainer>
      <VerticalCenterContainer>
        <EmptyBlock />
        {keys.map((keyItem) => {
          // highlight container if value overlapped and equal 2
          const overlapkeyBySelectedTime =
            selectedTime !== null
              ? data[selectedTime].list.some(
                  (listItem, ind) => ind === keyItem && listItem === 2
                )
              : false;
          return (
            <AvailabilityItemKey
              key={keyItem}
              selected={selectedKey === keyItem}
              availableTime={overlapkeyBySelectedTime}
              onClick={handleSelectColumn(keyItem)}
            >
              {keyItem + 1}
            </AvailabilityItemKey>
          );
        })}
      </VerticalCenterContainer>
      <div>
        {data.map((item) => {
          // highlight container if value overlapped and equal 2
          const overlapTimeBySelectedKey =
            selectedKey !== null ? item.list[selectedKey] === 2 : false;
          return (
            <AvailabilityTableRow
              key={item.id}
              selected={selectedTime === item.id}
            >
              <AvailabilityTime
                selected={selectedTime === item.id}
                availableTime={overlapTimeBySelectedKey}
                onClick={handleSelectRow(item.id)}
              >
                {item.time}
              </AvailabilityTime>
              {item.list.map((listItem, index) => {
                // hover vertical column if relative key was selected
                const selectedColumn = selectedKey === index;
                // hover horizontal row if relative time was selected
                const selectedRow =
                  selectedTime !== null ? item.id === selectedTime : false;
                return (
                  <>
                    <AvailabilityValueContainer
                      key={index}
                      selectedColumn={selectedColumn}
                    >
                      {(selectedRow || selectedColumn) && (
                        <BluredBlock extra={selectedRow && selectedColumn} />
                      )}
                      <AvailabilityValue value={listItem}>
                        {listItem}
                      </AvailabilityValue>
                    </AvailabilityValueContainer>
                  </>
                );
              })}
            </AvailabilityTableRow>
          );
        })}
      </div>
    </AvailabilityTableContainer>
  );
};

export default AvailabilityTable;
