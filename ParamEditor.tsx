import React, {FC, useState, ChangeEvent, useCallback, useMemo} from "react";

type Color = string;
type TypesForm = string | number;
type ParamType = "string" | "number";

interface Param {
    id: number;
    name: string;
    type: ParamType;
}

interface ParamValue {
    paramId: number;
    value: TypesForm;
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

const params: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
    { id: 3, name: "Численное измерение", type: "number" },
    { id: 4, name: "Длина", type: "number" },
];

const initialModel: Model = {
    paramValues: [
        { paramId: 1, value: "повседневное" },
        { paramId: 2, value: "макси" },
        { paramId: 3, value: 1234 },
        { paramId: 4, value: 21 },
    ],
    colors: ["red", "blue"],
};

const convertValue = (value: string, type: ParamType): TypesForm =>
    type === "number" ? (!isNaN(Number(value)) ? Number(value) : 0) : value;

interface ParamFieldProps {
    param: Param;
    value: TypesForm;
    onChange: (newValue: TypesForm) => void;
}

const ParamField: FC<ParamFieldProps> = React.memo(({ param, value, onChange }) => (
    <div>
        <label>{param.name}</label>
        <input
            type={param.type === "number" ? "number" : "text"}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(convertValue(e.target.value, param.type))
            }
        />
    </div>
));

interface ColorInputProps {
    colors: Color[];
    onAddColor: (color: string) => void;
}

const ColorInput: FC<ColorInputProps> = React.memo(({ colors, onAddColor }) => {
    const [newColor, setNewColor] = useState<string>("");

    const handleAddColor = useCallback(() => {
        if (newColor.trim()) {
            onAddColor(newColor.trim());
            setNewColor("");
        }
    }, [newColor, onAddColor]);

    return (
        <div>
            <label>Добавить цвет:</label>
            <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
            />
            <button onClick={handleAddColor}>Добавить</button>
            <div>
                <strong>Цвета:</strong> {colors.join(", ")}
            </div>
        </div>
    );
});
const ParamEditor: FC = () => {
    const [model, setModel] = useState<Model>(initialModel);

    const handleParamChange = useCallback((paramId: number, newValue: TypesForm): void => {
        setModel((prevModel) => ({
            ...prevModel,
            paramValues: prevModel.paramValues.map((paramValue) =>
                paramValue.paramId === paramId
                    ? { ...paramValue, value: newValue }
                    : paramValue
            ),
        }));
    }, []);

    const handleAddColor = useCallback((newColor: string): void => {
        setModel((prevModel) => ({
            ...prevModel,
            colors: [...prevModel.colors, newColor],
        }));
    }, []);

    const paramValuesMap = useMemo(() => {
        return new Map(model.paramValues.map((pv) => [pv.paramId, pv.value]));
    }, [model.paramValues]);

    return (
        <div>
            {params.map((param) => (
                <ParamField
                    key={param.id}
                    param={param}
                    value={paramValuesMap.get(param.id) || ""}
                    onChange={(newValue) => handleParamChange(param.id, newValue)}
                />
            ))}

            <ColorInput colors={model.colors} onAddColor={handleAddColor} />

            <button onClick={() => console.log(model)}>Получить модель</button>
        </div>
    );
};


export default ParamEditor;
