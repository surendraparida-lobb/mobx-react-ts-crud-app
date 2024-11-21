import { makeAutoObservable } from "mobx";
import axios from "axios";

interface City {
  city_name: string;
  branch: string;
  zone: string;
  city_id: string;
}

interface Branch {
  branch_id: string;
  branch_name: string;
}

class CityStore {
  cities: City[] = [];
  branches: Branch[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCities() {
    try {
      const response = await axios.get(
        "https://1a77d97a-9cb6-4ff6-9389-54c70d8bf298.mock.pstmn.io/pipe/city"
      );
      this.cities = response.data.Data;
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  }

  async fetchBranches() {
    try {
      const response = await axios.get(
        "https://1a77d97a-9cb6-4ff6-9389-54c70d8bf298.mock.pstmn.io/pipe/branches"
      );
      this.branches = response.data.Data;
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  }

  async addCity(city_name: string, branch: string, zone: string) {
    try {
      const response = await axios.post(
        "https://1a77d97a-9cb6-4ff6-9389-54c70d8bf298.mock.pstmn.io/pipe/city",
        { city_name, branch, zone }
      );
      if (response.status === 200) {
        this.fetchCities();
      }
    } catch (error) {
      console.error("Failed to add city:", error);
    }
  }

  async editCity(city_id: string, branch: string, zone: string) {
    try {
      const response = await axios.post(
        "https://1a77d97a-9cb6-4ff6-9389-54c70d8bf298.mock.pstmn.io/pipe/update-cities",
        { city_id, branch, zone }
      );
      if (response.status === 200) {
        this.fetchCities();
      }
    } catch (error) {
      console.error("Failed to edit city:", error);
    }
  }
}

const cityStore = new CityStore();
export default cityStore;
