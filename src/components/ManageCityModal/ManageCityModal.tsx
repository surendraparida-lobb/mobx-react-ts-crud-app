import React, { useState, useEffect } from "react";
import cityStore from "../../utils/stores/CityStore";
import { observer } from "mobx-react-lite";
import "./ManageCityModal.css";

interface Props {
    cityId?: string | null;
    onClose: () => void;
}

const ManageCityModal: React.FC<Props> = observer(({ cityId, onClose }) => {
    const city = cityId ? cityStore.cities.find((c) => c.city_id === cityId) : null;
    const [cityName, setCityName] = useState(city?.city_name || "");
    const [branch, setBranch] = useState(city?.branch || "");
    const [zone, setZone] = useState(city?.zone || "");
    const [error, setError] = useState<string | null>(null);

    // Function to check if city exists in the store
    const isCityNameUnique = (name: string): boolean => {
        return !cityStore.cities.some((c) => c.city_name.toLowerCase() === name.toLowerCase());
    };

    useEffect(() => {
        if (city) {
            setCityName(city.city_name);
            setBranch(city.branch);
            setZone(city.zone);
        }
    }, [city]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSaveCity = () => {
        if (cityId) {
            cityStore.editCity(cityId, branch, zone);
        } else {
            if (!isCityNameUnique(cityName)) {
                setError("City already exists");
                return;
            }
            cityStore.addCity(cityName, branch, zone);
            setError(null); 
        }
        onClose();
    };

    const handleCityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCityName = e.target.value;
        setCityName(newCityName);

        if (!isCityNameUnique(newCityName)) {
            setError("City already exists");
        } else {
            setError(null);
        }
    };

    return (
        <div className="modal-container" onClick={handleBackdropClick}>
            <div className="modal">
                <h2 className="modal-title">{cityId ? "Edit City" : "Add New City"}</h2>
                <p className="modal-subtitle">
                    {cityId
                        ? "Please modify the details of the selected city."
                        : "Please enter the ‘City Name’ and choose a Branch and respective ‘Zone’."
                    }
                </p>

                <div className="form-container">
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="City"
                        value={cityName}
                        onChange={handleCityNameChange}
                        disabled={!!cityId}
                    />
                    <select
                        className="modal-select"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                    >
                        <option value="">Branch</option>
                        {cityStore.branches.map((b) => (
                            <option key={b.branch_id} value={b.branch_name}>
                                {b.branch_name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="modal-select"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                    >
                        <option value="">Zone</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>
                {error && <div className="error-message">{error}</div>}

                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="add-button"
                        onClick={handleSaveCity}
                        disabled={!cityName || !branch || !zone || !!error}
                    >
                        {cityId ? "Save" : "Add City"}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ManageCityModal;
