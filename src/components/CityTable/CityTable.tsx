import React, { useState, useEffect } from "react";
import cityStore from "../../utils/stores/CityStore";
import ManageCityModal from "../ManageCityModal/ManageCityModal";
import { observer } from "mobx-react-lite";
import "./CityTable.css";

const CityTable: React.FC = observer(() => {
    const [showManageModal, setShowManageModal] = useState(false);
    const [editCityId, setEditCityId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedZone, setSelectedZone] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");

    useEffect(() => {
        cityStore.fetchCities();
        cityStore.fetchBranches();
    }, []);

    // Filtered city data based on search, zone, and branch
    const filteredCities = cityStore.cities.filter((city) => {
        return (
            (searchQuery === "" || city.city_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedZone === "" || city.zone === selectedZone) &&
            (selectedBranch === "" || city.branch === selectedBranch)
        );
    });

    // Get unique values for dropdowns
    const uniqueZones = Array.from(new Set(cityStore.cities.map((city) => city.zone)));
    const uniqueBranches = Array.from(new Set(cityStore.cities.map((city) => city.branch)));

    return (
        <div className="city-table-container">
            <div className="header-container">
                <div className="filter-container">
                    <input
                        type="text"
                        placeholder="Search City"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="dropdown"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                    >
                        <option value="">Zone</option>
                        {uniqueZones.map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                    </select>
                    <select
                        className="dropdown"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">Branch</option>
                        {uniqueBranches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="add-button" onClick={() => setShowManageModal(true)}>
                    <span>+</span> Add City
                </button>
            </div>
            <table className="city-table">
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Zone</th>
                        <th>Branch</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCities.map((city) => (
                        <tr key={city.city_id}>
                            <td>{city.city_name}</td>
                            <td>{city.zone}</td>
                            <td>{city.branch}</td>
                            <td className="actions">
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        console.log("Edit button clicked for city ID:", city.city_id);
                                        setEditCityId(city.city_id);
                                        setShowManageModal(true)
                                    }}
                                >
                                    ✏️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showManageModal && (
                <ManageCityModal
                    cityId={editCityId}
                    onClose={() => {
                        setShowManageModal(false);
                        setEditCityId(null);
                    }}
                />
            )}
        </div>
    );
});

export default CityTable;
