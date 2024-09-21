import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AddApiKeyModalComponent } from '../add-api-key-modal/add-api-key-modal.component';

// Assuming you have components for adding/editing providers and models
import { AddApiProviderModalComponent } from '../add-api-provider-modal/add-api-provider-modal.component';
import { AddModelModalComponent } from '../add-model-modal/add-model-modal.component';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class SettingsPage implements OnInit {
  apiKeys: { name: string, key: string }[] = [];
  selectedApiKeyIndex: number = 0;

  apiProviders: { name: string, baseUrl?: string }[] = []; 
  selectedApiProviderIndex: number = 0;

  models: { name: string, value: string }[] = [];
  selectedModelIndex: number = 0;

  systemPrompt = '';
  isMultiTurnCotEnabled = false;
  isSingleTurnCotEnabled = false;
  isWebGroundingEnabled = false;
  isMultimodalEnabled = false;

  constructor(
    private router: Router,
    private storage: Storage,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.storage.create();

    this.apiKeys = await this.storage.get('apiKeys') || [];
    this.selectedApiKeyIndex = await this.storage.get('selectedApiKeyIndex') || 0;

    this.apiProviders = await this.storage.get('apiProviders') || [];
    this.selectedApiProviderIndex = await this.storage.get('selectedApiProviderIndex') || 0;

    this.models = await this.storage.get('models') || [];
    this.selectedModelIndex = await this.storage.get('selectedModelIndex') || 0;

    this.systemPrompt = await this.storage.get('systemPrompt') || '';
    this.isMultiTurnCotEnabled = await this.storage.get('isMultiTurnCotEnabled') || false;
    this.isSingleTurnCotEnabled = await this.storage.get('isSingleTurnCotEnabled') || false;
    this.isWebGroundingEnabled = await this.storage.get('isWebGroundingEnabled') || false;
    this.isMultimodalEnabled = await this.storage.get('isMultimodalEnabled') || false;

    // Ensure selectedApiKeyIndex is within bounds
    if (this.selectedApiKeyIndex >= this.apiKeys.length) {
      this.selectedApiKeyIndex = this.apiKeys.length > 0 ? this.apiKeys.length - 1 : 0;
    }

    // Ensure selectedApiProviderIndex is within bounds
    if (this.selectedApiProviderIndex >= this.apiProviders.length) {
      this.selectedApiProviderIndex = this.apiProviders.length > 0 ? this.apiProviders.length - 1 : 0;
    }

    // Ensure selectedModelIndex is within bounds
    if (this.selectedModelIndex >= this.models.length) {
      this.selectedModelIndex = this.models.length > 0 ? this.models.length - 1 : 0;
    }
  }

  async showAddApiKeyModal() {
    const modal = await this.modalController.create({
      component: AddApiKeyModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.key) {
        this.apiKeys.push(data.data);
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  async editApiKey(index: number) {
    const modal = await this.modalController.create({
      component: AddApiKeyModalComponent,
      componentProps: {
        apiKey: this.apiKeys[index],
        index: index
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.key) {
        this.apiKeys[index] = data.data;
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  removeApiKey(index: number) {
    this.apiKeys.splice(index, 1);
    if (this.selectedApiKeyIndex === index) {
      this.selectedApiKeyIndex = this.apiKeys.length > 0 ? 0 : 0;
    }
    this.saveSettings();
  }

  async showAddApiProviderModal() {
    const modal = await this.modalController.create({
      component: AddApiProviderModalComponent, 
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.baseUrl) {
        this.apiProviders.push(data.data);
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  async editApiProvider(index: number) { 
    const modal = await this.modalController.create({
      component: AddApiProviderModalComponent,
      componentProps: {
        apiProvider: this.apiProviders[index],
        index: index
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.baseUrl) {
        this.apiProviders[index] = data.data;
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  removeApiProvider(index: number) {
    this.apiProviders.splice(index, 1);
    if (this.selectedApiProviderIndex === index) {
      this.selectedApiProviderIndex = this.apiProviders.length > 0 ? 0 : 0;
    }
    this.saveSettings();
  }


  async showAddModelModal() {
    const modal = await this.modalController.create({
      component: AddModelModalComponent, 
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.value) {
        this.models.push(data.data);
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  async editModel(index: number) { 
    const modal = await this.modalController.create({
      component: AddModelModalComponent,
      componentProps: {
        model: this.models[index],
        index: index
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.name && data.data.value) {
        this.models[index] = data.data;
        this.saveSettings();
      }
    });

    return await modal.present();
  }

  removeModel(index: number) {
    this.models.splice(index, 1);
    if (this.selectedModelIndex === index) {
      this.selectedModelIndex = this.models.length > 0 ? 0 : 0;
    }
    this.saveSettings();
  }


  async saveSettings() {
    await this.storage.set('apiKeys', this.apiKeys);
    await this.storage.set('selectedApiKeyIndex', this.selectedApiKeyIndex);

    await this.storage.set('apiProviders', this.apiProviders); 
    await this.storage.set('selectedApiProviderIndex', this.selectedApiProviderIndex);

    await this.storage.set('models', this.models);
    await this.storage.set('selectedModelIndex', this.selectedModelIndex);

    await this.storage.set('systemPrompt', this.systemPrompt);
    await this.storage.set('isMultiTurnCotEnabled', this.isMultiTurnCotEnabled);
    await this.storage.set('isSingleTurnCotEnabled', this.isSingleTurnCotEnabled);
    await this.storage.set('isWebGroundingEnabled', this.isWebGroundingEnabled);
    await this.storage.set('isMultimodalEnabled', this.isMultimodalEnabled);

    // You'll need to determine how to select and save the active 
    // API provider and model based on the selected indices.
    // For example:
    const selectedApiProvider = this.apiProviders[this.selectedApiProviderIndex];
    await this.storage.set('baseUrl', selectedApiProvider.baseUrl || ''); 

    const selectedModel = this.models[this.selectedModelIndex];
    await this.storage.set('model', selectedModel.value); 

    window.location.reload();
  }

  getSelectedApiKey(): string | null {
    if (this.apiKeys.length > 0 && this.selectedApiKeyIndex < this.apiKeys.length) {
      return this.apiKeys[this.selectedApiKeyIndex].key;
    } else {
      return null;
    }
  }

  getSelectedApiProviderName(): string {
    return this.apiProviders[this.selectedApiProviderIndex].name;
  }

  getSelectedApiProviderBaseUrl(): string {
    return this.apiProviders[this.selectedApiProviderIndex].baseUrl || ''; 
  }

  getSelectedModelName(): string {
    return this.models[this.selectedModelIndex].name;
  }

  getSelectedModelValue(): string {
    return this.models[this.selectedModelIndex].value;
  }

  onCotToggleChange() {
    if (this.isMultiTurnCotEnabled && this.isSingleTurnCotEnabled) {
      if (this.isMultiTurnCotEnabled) { 
        this.isSingleTurnCotEnabled = false;
      } else {
        this.isMultiTurnCotEnabled = false;
      }
    }
  }
}